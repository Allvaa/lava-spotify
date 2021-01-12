import Node from "./Node";
import request from "node-superfetch";

export default class Resolver {
    public client = this.node.client;

    public constructor(public node: Node) {}

    public get token(): string {
        return this.client.token!;
    }

    public async getAlbum(id: string): Promise<any> {
        let album: any;
        try {
            album = (await request
                .get(`${this.client.baseURL}/albums/${id}`)
                .set("Authorization", this.token)).body;
        } catch { /**/ }

        return {
            loadType: album ? "PLAYLIST_LOADED" : "NO_MATCHES",
            playlistInfo: {
                name: album?.name
            },
            tracks: album ? await Promise.all(album.tracks.items.map((x: any) => this.resolve(x))) : []
        };
    }

    private async resolve(track: any): Promise<any> {
        const params = new URLSearchParams({
            identifier: `ytsearch:${track.artists[0].name} - ${track.name}`
        }).toString();

        const { body }: any = await request
            .get(`http://${this.node.options.host}:${this.node.options.port}/loadtracks?${params}`)
            .set("Authorization", this.node.options.password);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return body.tracks ? body.tracks[0] : undefined;
    }
}
