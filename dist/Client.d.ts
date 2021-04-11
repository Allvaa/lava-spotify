import { ClientOptions, NodeOptions } from "./typings";
import Node from "./structures/Node";
export default class LavasfyClient {
    readonly baseURL: string;
    options: Readonly<ClientOptions>;
    nodes: Map<string, Node>;
    token: string | null;
    spotifyPattern: RegExp;
    private nextRequest?;
    constructor(options: ClientOptions, nodesOpt: NodeOptions[]);
    addNode(options: NodeOptions): void;
    isValidURL(url: string): boolean;
    requestToken(): Promise<void>;
}
