import type { LavalinkNode, LavalinkTrack, LavalinkTrackResponse, SpotifyAlbum, SpotifyOptions, SpotifyPlaylist, SpotifyTrack } from "../typings";
import fetch from "node-fetch";

const spotifyPattern = /^(?:https:\/\/open\.spotify\.com\/|spotify:)(album|playlist|track)(?:[/:])([A-Za-z0-9]+).*$/;

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
            loadType: "PLAYLIST_LOADED",
            playlistInfo: {
                name: album.name
            },
            tracks: await Promise.all(album.tracks.items.map(x => this.resolve(x)))
        }: album;
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

        return asLavaTrack ? {
            loadType: "PLAYLIST_LOADED",
            playlistInfo: {
                name: playlist.name
            },
            tracks: await Promise.all(playlist.tracks.items.map(x => this.resolve(x)))
        }: playlist;
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
            loadType: "TRACK_LOADED",
            playlistInfo: {},
            tracks: [await this.resolve(track)]
        }: track;
    }

    private async resolve(track: SpotifyTrack): Promise<LavalinkTrack> {
        const params = new URLSearchParams({
            identifier: `ytsearch:${track.artists[0].name} - ${track.name}`
        }).toString();

        return (await (await fetch(`http://${this.node.host}:${this.node.port}/loadtracks?${params}`, {
            headers: {
                Authorization: this.node.password
            }
        })).json()).tracks[0] as LavalinkTrack;
    }

    public async requestToken(): Promise<void> {
        clearTimeout(this.nextRequest!);
        delete this.nextRequest;

        const auth = Buffer.from(`${this.options.clientID}:${this.options.clientSecret}`).toString("base64");

        const { access_token, token_type, expires_in } = await (await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            body: "grant_type=client_credentials",
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })).json();

        this.token = `${token_type} ${access_token}`;
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this.nextRequest = setTimeout(this.requestToken.bind(this), expires_in * 1000);
    }
}
