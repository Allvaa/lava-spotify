import { ClientOptions, NodeOptions } from "./typings";
import Node from "./structures/Node";
export default class LavasfyClient {
    readonly baseURL = "https://api.spotify.com/v1";
    options: ClientOptions;
    nodes: Map<string, Node>;
    token: string | null;
    spotifyPattern: RegExp;
    private nextRequest?;
    constructor(options: ClientOptions, nodesOpt: NodeOptions[]);
    addNode(options: NodeOptions): void;
    isValidURL(url: string): boolean;
    requestToken(): Promise<void>;
}
