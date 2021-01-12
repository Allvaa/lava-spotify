import { ClientOptions, NodeOptions } from "./typings";
import Node from "./structures/Node";
export default class Client {
    options: ClientOptions;
    readonly baseURL = "https://api.spotify.com/v1";
    nodes: Map<string, Node>;
    token: string | null;
    spotifyPattern: RegExp;
    private nextRequest?;
    constructor(options: ClientOptions, nodesOpt: NodeOptions[]);
    addNode(options: NodeOptions): void;
    getNode(id: string): Node | undefined;
    isValidURL(url: string): boolean;
    requestToken(): Promise<void>;
}
