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
        try {
            if (!this.token) throw new Error("No Spotify access token.");
            // @ts-expect-error 2322
            const { body: spotifyAlbum }: { body: SpotifyAlbum } = await request
                .get(`${this.client.baseURL}/albums/${id}`)
                .set("Authorization", this.token);

            const unresolvedAlbumTracks = spotifyAlbum?.tracks.items.map(track => this.buildUnresolved(track)) ?? [];

            return this.buildResponse(
                "PLAYLIST_LOADED",
                this.autoResolve ? (await Promise.all(unresolvedAlbumTracks.map(x => x.resolve()))).filter(Boolean) as LavalinkTrack[] : unresolvedAlbumTracks,
                spotifyAlbum.name
            );
        } catch (e) {
            return this.buildResponse(e.body?.error.message === "invalid id" ? "NO_MATCHES" : "LOAD_FAILED", [], undefined, e.body?.error.message ?? e.message);
        }
    }

    public async getPlaylist(id: string): Promise<LavalinkTrackResponse> {
        try {
            if (!this.token) throw new Error("No Spotify access token.");
            // @ts-expect-error 2322
            const { body: spotifyPlaylist }: { body: SpotifyPlaylist } = await request
                .get(`${this.client.baseURL}/playlists/${id}`)
                .set("Authorization", this.token);

            const unresolvedPlaylistTracks = (await this.getPlaylistTracks(spotifyPlaylist)).map(x => this.buildUnresolved(x.track));

            return this.buildResponse(
                "PLAYLIST_LOADED",
                this.autoResolve ? (await Promise.all(unresolvedPlaylistTracks.map(x => x.resolve()))).filter(Boolean) as LavalinkTrack[] : unresolvedPlaylistTracks,
                spotifyPlaylist.name
            );
        } catch (e) {
            return this.buildResponse(e.status === 404 ? "NO_MATCHES" : "LOAD_FAILED", [], undefined, e.body?.error.message ?? e.message);
        }
    }

    public async getTrack(id: string): Promise<LavalinkTrackResponse> {
        try {
            if (!this.token) throw new Error("No Spotify access token.");
            // @ts-expect-error 2322
            const { body: spotifyTrack }: { body: SpotifyTrack } = await request
                .get(`${this.client.baseURL}/tracks/${id}`)
                .set("Authorization", this.token);

            const unresolvedTrack = this.buildUnresolved(spotifyTrack);

            return this.buildResponse(
                "TRACK_LOADED",
                this.autoResolve ? [await unresolvedTrack.resolve()] as LavalinkTrack[] : [unresolvedTrack]
            );
        } catch (e) {
            return this.buildResponse(e.body?.error.message === "invalid id" ? "NO_MATCHES" : "LOAD_FAILED", [], undefined, e.body?.error.message ?? e.message);
        }
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
    }

    private async retrieveTrack(unresolvedTrack: UnresolvedTrack): Promise<LavalinkTrack | undefined> {
        const params = new URLSearchParams({
            identifier: `ytsearch:${unresolvedTrack.info.author} - ${unresolvedTrack.info.title} ${this.client.options.audioOnlyResults ? "Audio" : ""}`
        });
        // @ts-expect-error 2322
        const { body: response }: { body: LavalinkTrackResponse<LavalinkTrack> } = await request
            .get(`http${this.node.secure ? "s" : ""}://${this.node.host}:${this.node.port}/loadtracks?${params.toString()}`)
            .set("Authorization", this.node.password);
        return response.tracks[0];
    }

    private buildUnresolved(spotifyTrack: SpotifyTrack): UnresolvedTrack {
        const _this = this; // eslint-disable-line
        return {
            info: {
                identifier: spotifyTrack.id,
                title: spotifyTrack.name,
                author: spotifyTrack.artists.join(", "),
                uri: spotifyTrack.external_urls.spotify,
                length: spotifyTrack.duration_ms
            },
            resolve(): Promise<LavalinkTrack | undefined> {
                return _this.resolve(this); 
            }
        };
    }

    private buildResponse(loadType: LavalinkTrackResponse["loadType"], tracks: Array<UnresolvedTrack | LavalinkTrack> = [], playlistName?: string, exceptionMsg?: string): LavalinkTrackResponse {
        return Object.assign({
            loadType,
            tracks,
            playlistInfo: playlistName ? { name: playlistName }: {}
        }, exceptionMsg ? { exception: { message: exceptionMsg, severity: "COMMON" } } : {});
    }
}
