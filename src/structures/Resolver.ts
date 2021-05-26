import Node from "./Node";
import request from "node-superfetch";
import { LavalinkTrack, LavalinkTrackResponse, SpotifyAlbum, SpotifyPlaylist, SpotifyTrack, UnresolvedTrack } from "../typings";
import Util from "../Util";

export default class Resolver {
    public client = this.node.client;
    public cache = new Map<string, LavalinkTrack>();

    public constructor(public node: Node) {}

    public get token(): string {
        return this.client.token!;
    }

    public get playlistLoadLimit(): number {
        return this.client.options.playlistLoadLimit === 0
            ? Infinity
            : this.client.options.playlistLoadLimit!;
    }

    public get autoResolve(): boolean {
        return this.client.options.autoResolve!;
    }

    public async getAlbum(id: string): Promise<LavalinkTrackResponse> {
        const spotifyAlbum = await Util.tryPromise(async () => {
            return (await request
                .get(`${this.client.baseURL}/albums/${id}`)
                .set("Authorization", this.token)).body as SpotifyAlbum;
        });

        const unresolvedAlbumTracks = spotifyAlbum?.tracks.items.map(track => this.buildUnresolved(track)) ?? [];

        return {
            loadType: spotifyAlbum ? "PLAYLIST_LOADED" : "NO_MATCHES",
            playlistInfo: {
                name: spotifyAlbum?.name
            },
            tracks: this.autoResolve ? (await Promise.all(unresolvedAlbumTracks.map(x => x.resolve()))).filter(Boolean) as LavalinkTrack[] : unresolvedAlbumTracks
        };
    }

    public async getPlaylist(id: string): Promise<LavalinkTrackResponse> {
        const spotifyPlaylist = await Util.tryPromise(async () => {
            return (await request
                .get(`${this.client.baseURL}/playlists/${id}`)
                .set("Authorization", this.token)).body as SpotifyPlaylist;
        });

        const unresolvedPlaylistTracks = spotifyPlaylist ? (await this.getPlaylistTracks(spotifyPlaylist)).map(x => this.buildUnresolved(x.track)) : [];

        return {
            loadType: spotifyPlaylist ? "PLAYLIST_LOADED" : "NO_MATCHES",
            playlistInfo: {
                name: spotifyPlaylist?.name
            },
            tracks: this.autoResolve ? (await Promise.all(unresolvedPlaylistTracks.map(x => x.resolve()))).filter(Boolean) as LavalinkTrack[] : unresolvedPlaylistTracks
        };
    }

    public async getTrack(id: string): Promise<LavalinkTrackResponse> {
        const spotifyTrack = await Util.tryPromise(async () => {
            return (await request
                .get(`${this.client.baseURL}/tracks/${id}`)
                .set("Authorization", this.token)).body as SpotifyTrack;
        });

        const unresolvedTrack = spotifyTrack && this.buildUnresolved(spotifyTrack);

        return {
            loadType: spotifyTrack ? "TRACK_LOADED" : "NO_MATCHES",
            playlistInfo: {},
            tracks: spotifyTrack ? this.autoResolve ? [await unresolvedTrack!.resolve()] as LavalinkTrack[] : [unresolvedTrack!] : []
        };
    }

    private async getPlaylistTracks(playlist: {
        tracks: {
            items: Array<{ track: SpotifyTrack }>;
            next: string | null;
        };
    }, currPage = 1): Promise<Array<{ track: SpotifyTrack }>> {
        if (!playlist.tracks.next || currPage >= this.playlistLoadLimit) return playlist.tracks.items;
        currPage++;

        const { body }: any = await request
            .get(playlist.tracks.next)
            .set("Authorization", this.token);

        const { items, next }: { items: Array<{ track: SpotifyTrack }>; next: string | null } = body;

        const mergedPlaylistTracks = playlist.tracks.items.concat(items);

        if (next && currPage < this.playlistLoadLimit) return this.getPlaylistTracks({
            tracks: {
                items: mergedPlaylistTracks,
                next
            }
        }, currPage);
        else return mergedPlaylistTracks;
    }

    private async resolve(unresolvedTrack: UnresolvedTrack): Promise<LavalinkTrack | undefined> {
        const cached = this.cache.get(unresolvedTrack.info.identifier);
        if (cached) return Util.structuredClone(cached);

        try {
            const lavaTrack = await this.retrieveTrack(unresolvedTrack);
            if (lavaTrack) {
                if (this.client.options.useSpotifyMetadata) {
                    Object.assign(lavaTrack.info, {
                        title: unresolvedTrack.info.title,
                        author: unresolvedTrack.info.author,
                        uri: unresolvedTrack.info.uri
                    });
                }
                this.cache.set(unresolvedTrack.info.identifier, Object.freeze(lavaTrack));
            }
            return Util.structuredClone(lavaTrack);
        } catch {
            return undefined;
        }
    }

    private async retrieveTrack(unresolvedTrack: UnresolvedTrack): Promise<LavalinkTrack | undefined> {
        try {
            const params = new URLSearchParams({
                identifier: `ytsearch:${unresolvedTrack.info.author} - ${unresolvedTrack.info.title} ${this.client.options.audioOnlyResults ? "Audio" : ""}`
            });
            // @ts-expect-error 2322
            const { body: response }: { body: LavalinkTrackResponse<LavalinkTrack> } = await request
                .get(`http${this.node.secure ? "s" : ""}://${this.node.host}:${this.node.port}/loadtracks?${params.toString()}`)
                .set("Authorization", this.node.password);
            return response.tracks[0];
        } catch {
            return undefined;
        }
    }

    private buildUnresolved(spotifyTrack: SpotifyTrack): UnresolvedTrack {
        const unresolved: UnresolvedTrack = {
            info: {
                identifier: spotifyTrack.id,
                title: spotifyTrack.name,
                author: spotifyTrack.artists.join(", "),
                uri: spotifyTrack.external_urls.spotify,
                length: spotifyTrack.duration_ms
            },
            resolve: () => Promise.resolve(undefined)
        };

        return { ...unresolved, resolve: (): Promise<LavalinkTrack | undefined> => this.resolve(unresolved) };
    }
}
