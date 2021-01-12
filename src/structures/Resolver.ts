import Node from "./Node";
import request from "node-superfetch";
import { LavalinkTrack, LavalinkTrackResponse, SpotifyAlbum, SpotifyTrack } from "../typings";

export default class Resolver {
    public client = this.node.client;

    public constructor(public node: Node) {}

    public get token(): string {
        return this.client.token!;
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

    private async resolve(track: SpotifyTrack): Promise<LavalinkTrack | undefined> {
        const params = new URLSearchParams({
            identifier: `ytsearch:${track.artists[0].name} - ${track.name}`
        }).toString();

        // @ts-expect-error 2322
        const { body }: { body: LavalinkTrackResponse } = await request
            .get(`http://${this.node.options.host}:${this.node.options.port}/loadtracks?${params}`)
            .set("Authorization", this.node.options.password);

        return body.exception ? undefined : body.tracks[0];
    }
}
