import { ClientOptions, NodeOptions } from "./typings";
import Node from "./structures/Node";
export default class LavasfyClient {
    options: Readonly<ClientOptions>;
    nodes: Map<string, Node>;
    readonly baseURL: string;
    readonly spotifyPattern: RegExp;
    readonly token: string | null;
    private nextRequest?;
    constructor(options: ClientOptions, nodesOpt: NodeOptions[]);
    addNode(options: NodeOptions): void;
    isValidURL(url: string): boolean;
    requestToken(): Promise<void>;
}
