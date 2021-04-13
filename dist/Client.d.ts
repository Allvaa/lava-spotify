import { ClientOptions, NodeOptions } from "./typings";
import Node from "./structures/Node";
export default class LavasfyClient {
    /** The provided options */
    options: Readonly<ClientOptions>;
    /** The {@link Node}s are stored here */
    nodes: Map<string, Node>;
    /** Spotify API base URL */
    readonly baseURL: string;
    /** A RegExp to validate and parse URLs */
    readonly spotifyPattern: RegExp;
    /** The token to access the Spotify API */
    readonly token: string | null;
    private nextRequest?;
    constructor(options: ClientOptions, nodesOpt: NodeOptions[]);
    addNode(options: NodeOptions): void;
    /** Used to validate Spotify URLs */
    isValidURL(url: string): boolean;
    /** A method to retrieve the Spotify API token. (this method must be invoked) */
    requestToken(): Promise<void>;
}
