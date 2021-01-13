import Node from "./Node";
import request from "node-superfetch";
import { LavalinkTrack, LavalinkTrackResponse, SpotifyAlbum, SpotifyPlaylist, SpotifyTrack } from "../typings";

export default class Resolver {
    public client = this.node.client;

    public constructor(public node: Node) {}

    public get token(): string {
        return this.client.token!;
    }

    public get playlistPageLoadLimit(): number {
        return this.client.options.playlistPageLoadLimit === 0
            ? Infinity
            : this.client.options.playlistPageLoadLimit ?? 2;
    }

    public async getAlbum(id: string): Promise<LavalinkTrackResponse> {
        let album: SpotifyAlbum | undefined;
        try {
            album = (await request
                .get(`${this.client.baseURL}/albums/${id}`)
                .set("Authorization", this.token)).body as SpotifyAlbum;
        } catch { /**/ }

        return {
            loadType: album ? "PLAYLIST_LOADED" : "NO_MATCHES",
            playlistInfo: {
                name: album?.name
            },
            tracks: album
                ? (await Promise.all(album.tracks.items.map(x => this.resolve(x)))).filter(Boolean) as LavalinkTrack[]
                : []
        };
    }

    public async getPlaylist(id: string): Promise<LavalinkTrackResponse> {
        let playlist: SpotifyPlaylist | undefined;
        try {
            playlist = (await request
                .get(`${this.client.baseURL}/playlists/${id}`)
                .set("Authorization", this.token)).body as SpotifyPlaylist;
        } catch { /**/ }

        const playlistTracks = playlist ? await this.getPlaylistTracks(playlist) : [];

        return {
            loadType: playlist ? "PLAYLIST_LOADED" : "NO_MATCHES",
            playlistInfo: {
                name: playlist?.name
            },
            tracks: (await Promise.all(playlistTracks.map(x => this.resolve(x.track)))).filter(Boolean) as LavalinkTrack[]
        };
    }

    public async getTrack(id: string): Promise<LavalinkTrackResponse> {
        let track: SpotifyTrack | undefined;
        try {
            track = (await request
                .get(`${this.client.baseURL}/tracks/${id}`)
                .set("Authorization", this.token)).body as SpotifyTrack;
        } catch { /**/ }

        return {
            loadType: track ? "TRACK_LOADED" : "NO_MATCHES",
            playlistInfo: {},
            tracks: track ? [(await this.resolve(track))!] : []
        };
    }

    private async getPlaylistTracks(playlist: {
        tracks: {
            items: Array<{ track: SpotifyTrack }>;
            next: string | null;
        };
    }, currPage = 0): Promise<Array<{ track: SpotifyTrack }>> {
        if (!playlist.tracks.next) return playlist.tracks.items;
        currPage++;

        const { body }: any = await request
            .get(playlist.tracks.next)
            .set("Authorization", this.token);

        const { items, next }: { items: Array<{ track: SpotifyTrack }>; next: string | null } = body;

        const mergedPlaylistTracks = playlist.tracks.items.concat(items);

        if (next && currPage < this.playlistPageLoadLimit) return this.getPlaylistTracks({
            tracks: {
                items: mergedPlaylistTracks,
                next
            }
        }, currPage);
        else return mergedPlaylistTracks;
    }

    private async resolve(track: SpotifyTrack): Promise<LavalinkTrack | undefined> {
        try {
            const params = new URLSearchParams({
                identifier: `ytsearch:${track.artists[0].name} - ${track.name}`
            }).toString();

            // @ts-expect-error 2322
            const { body }: { body: LavalinkTrackResponse } = await request
                .get(`http://${this.node.options.host}:${this.node.options.port}/loadtracks?${params}`)
                .set("Authorization", this.node.options.password);

            return body.exception ? undefined : body.tracks[0];
        } catch {
            return undefined;
        }
    }
}
