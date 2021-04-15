import { ClientOptions, NodeOptions } from "./typings";
import Node from "./structures/Node";
export default class LavasfyClient {
    /** The provided options when the class was instantiated */
    options: Readonly<ClientOptions>;
    /** The {@link Node}s are stored here */
    nodes: Map<string, Node>;
    /** Spotify API base URL */
    readonly baseURL: string;
    /** A RegExp that will be used for validate and parse URLs */
    readonly spotifyPattern: RegExp;
    /** The token to access the Spotify API */
    readonly token: string | null;
    private nextRequest?;
    constructor(options: ClientOptions, nodesOpt: NodeOptions[]);
    addNode(options: NodeOptions): void;
    /** Determine the URL is a valid Spotify URL or not */
    isValidURL(url: string): boolean;
    /** A method to retrieve the Spotify API token. (this method must be invoked) */
    requestToken(): Promise<void>;
}
