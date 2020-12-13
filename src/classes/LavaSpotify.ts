import type { LavalinkNode, LavalinkTrack, LavalinkTrackResponse, SpotifyAlbum, SpotifyOptions, SpotifyPlaylist, SpotifyPlaylistTrack, SpotifyTrack } from "../typings";
import fetch from "node-fetch";

const spotifyPattern = /^(?:https:\/\/open\.spotify\.com\/(?:user\/[A-Za-z0-9]+\/)?|spotify:)(album|playlist|track)(?:[/:])([A-Za-z0-9]+).*$/;

export default class LavaSpotify {
    private readonly baseURL = "https://api.spotify.com/v1";
    private token: string | null = null;
    private nextRequest?: NodeJS.Timeout;

    public constructor(public node: LavalinkNode, public options: SpotifyOptions) {}

    public isValidURL(url: string): boolean {
        return spotifyPattern.test(url);
    }

    public load(url: string): Promise<LavalinkTrackResponse> {
        const typeFuncs = {
            album: this.getAlbum.bind(this),
            playlist: this.getPlaylist.bind(this),
            track: this.getTrack.bind(this)
        };
        const [, type, id] = spotifyPattern.exec(url) ?? [];
        return typeFuncs[type as keyof typeof typeFuncs](id, true) as Promise<LavalinkTrackResponse>;
    }

    public async getAlbum(id: string): Promise<SpotifyAlbum>;
    public async getAlbum(id: string, asLavaTrack: false): Promise<SpotifyAlbum>;
    public async getAlbum(id: string, asLavaTrack: true): Promise<LavalinkTrackResponse>;
    public async getAlbum(id: string, asLavaTrack = false): Promise<unknown> {
        const album: SpotifyAlbum = await (await fetch(`${this.baseURL}/albums/${id}`, {
            headers: {
                Authorization: this.token!
            }
        })).json();

        return asLavaTrack ? {
            loadType: album.error ? "NO_MATCHES" : "PLAYLIST_LOADED",
            playlistInfo: {
                name: album.name
            },
            tracks: album.error ? [] : await Promise.all(album.tracks.items.map(x => this.resolve(x)))
        } : album;
    }

    public async getPlaylist(id: string): Promise<SpotifyPlaylist>;
    public async getPlaylist(id: string, asLavaTrack: false): Promise<SpotifyPlaylist>;
    public async getPlaylist(id: string, asLavaTrack: true): Promise<LavalinkTrackResponse>;
    public async getPlaylist(id: string, asLavaTrack = false): Promise<unknown> {
        const playlist: SpotifyPlaylist = await (await fetch(`${this.baseURL}/playlists/${id}`, {
            headers: {
                Authorization: this.token!
            }
        })).json();

        const playlistTracks = asLavaTrack ? await this.getPlaylistTracks(playlist) : playlist.tracks.items;

        return asLavaTrack ? {
            loadType: playlist.error ? "NO_MATCHES" : "PLAYLIST_LOADED",
            playlistInfo: {
                name: playlist.name
            },
            tracks: playlist.error ? [] : (await Promise.all(playlistTracks.map(x => this.resolve(x.track)))).filter(Boolean)
        } : playlist;
    }

    public async getTrack(id: string): Promise<SpotifyTrack>;
    public async getTrack(id: string, asLavaTrack: false): Promise<SpotifyTrack>;
    public async getTrack(id: string, asLavaTrack: true): Promise<LavalinkTrackResponse>;
    public async getTrack(id: string, asLavaTrack = false): Promise<unknown> {
        const track: SpotifyTrack = await (await fetch(`${this.baseURL}/tracks/${id}`, {
            headers: {
                Authorization: this.token!
            }
        })).json();

        return asLavaTrack ? {
            loadType: track.error ? "NO_MATCHES" : "TRACK_LOADED",
            playlistInfo: {},
            tracks: track.error ? [] : [await this.resolve(track)]
        } : track;
    }

    private async getPlaylistTracks(playlist: {
        tracks: {
            items: SpotifyPlaylistTrack[];
            next: string | null;
        };
    }): Promise<SpotifyPlaylistTrack[]> {
        if (!playlist.tracks.next) return playlist.tracks.items;
        const { items, next }: { items: SpotifyPlaylistTrack[]; next: string | null } = await (await fetch(playlist.tracks.next, {
            headers: {
                Authorization: this.token!
            }
        })).json();

        const mergedPlaylistTracks = playlist.tracks.items.concat(items);

        if (next) return this.getPlaylistTracks({
            tracks: {
                items: mergedPlaylistTracks,
                next
            }
        });
        else return mergedPlaylistTracks;
    }

    private async resolve(track: SpotifyTrack): Promise<LavalinkTrack | undefined> {
        const params = new URLSearchParams({
            identifier: `ytsearch:${track.artists[0].name} - ${track.name}`
        }).toString();

        const result = (await (await fetch(`http://${this.node.host}:${this.node.port}/loadtracks?${params}`, {
            headers: {
                Authorization: this.node.password
            }
        })).json());

        return result.tracks ? result.tracks[0] as LavalinkTrack : undefined;
    }

    public async requestToken(): Promise<void> {
        if (this.nextRequest) return;

        const auth = Buffer.from(`${this.options.clientID}:${this.options.clientSecret}`).toString("base64");

        try {
            const { access_token, token_type, expires_in, error } = await (await fetch("https://accounts.spotify.com/api/token", {
                method: "POST",
                body: "grant_type=client_credentials",
                headers: {
                    Authorization: `Basic ${auth}`,
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })).json();

            if (error === "invalid_client") return Promise.reject(new Error("Invalid Spotify client."));

            this.token = `${token_type} ${access_token}`;
            this.nextRequest = setTimeout(() => {
                delete this.nextRequest;
                void this.requestToken();
            }, expires_in * 1000);
        } catch {
            await this.requestToken();
        }
    }
}
