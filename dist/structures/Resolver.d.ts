import Node from "./Node";
import { LavalinkTrackResponse } from "../typings";
export default class Resolver {
    node: Node;
    client: import("..").Client;
    constructor(node: Node);
    get token(): string;
    getAlbum(id: string): Promise<LavalinkTrackResponse>;
    private resolve;
}
