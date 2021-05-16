import { ClientOptions, NodeOptions } from "./typings";
import request from "node-superfetch";
import Node from "./structures/Node";
import Util from "./Util";
import { DefaultClientOptions } from "./Constants";

export default class LavasfyClient {
    /** The provided options when the class was instantiated */
    public options: Readonly<ClientOptions>;
    /** The {@link Node}s are stored here */
    public nodes = new Map<string, Node>();
    /** Spotify API base URL */
    public readonly baseURL!: string;
    /** A RegExp that will be used for validate and parse URLs */
    public readonly spotifyPattern!: RegExp;
    /** The token to access the Spotify API */
    public readonly token!: string | null;

    private nextRequest?: NodeJS.Timeout;

    public constructor(options: ClientOptions, nodesOpt: NodeOptions[]) {
        Object.defineProperty(this, "baseURL", {
            enumerable: true,
            value: "https://api.spotify.com/v1"
        });
        Object.defineProperty(this, "spotifyPattern", {
            value: /^(?:https:\/\/open\.spotify\.com\/(?:user\/[A-Za-z0-9]+\/)?|spotify:)(album|playlist|track)(?:[/:])([A-Za-z0-9]+).*$/
        });
        Object.defineProperty(this, "token", {
            configurable: true,
            value: null
        });

        this.options = Object.freeze(Util.mergeDefault(DefaultClientOptions, options));
        for (const nodeOpt of nodesOpt) this.addNode(nodeOpt);
    }

    public addNode(options: NodeOptions): void {
        this.nodes.set(options.name, new Node(this, options));
    }

    public removeNode(query: string): boolean {
    	if(!this.nodes.size) throw new TypeError("No nodes available, please add a node first...");
    	if(!query) throw new TypeError("Provide a valid node identifier to delete it");

    	if(query && this.nodes.has(query)) return this.nodes.delete(query);
    	else return false;
    }

    public getNode(query?: string): Node | undefined {
        if (!this.nodes.size) throw new TypeError("No nodes available, please add a node first...");

        if (!query) return this.nodes.get([...this.nodes.values()][Math.floor(Math.random() * this.nodes.size)].name);

        
        if(query && this.nodes.has(query!)) return this.nodes.get(query);
        else return undefined;       
    }

    /** Determine the URL is a valid Spotify URL or not */
    public isValidURL(url: string): boolean {
        return this.spotifyPattern.test(url);
    }

    /** A method to retrieve the Spotify API token. (this method must be invoked) */
    public async requestToken(): Promise<void> {
        if (this.nextRequest) return;

        try {
            const { body: { access_token, token_type, expires_in } }: any = await request
                .post("https://accounts.spotify.com/api/token")
                .set({
                    Authorization: `Basic ${Buffer.from(`${this.options.clientID}:${this.options.clientSecret}`).toString("base64")}`,
                    "Content-Type": "application/x-www-form-urlencoded"
                })
                .send("grant_type=client_credentials");

            Object.defineProperty(this, "token", { value: `${token_type} ${access_token}` });
            Object.defineProperty(this, "nextRequest", {
                configurable: true,
                value: setTimeout(() => {
                    delete this.nextRequest;
                    void this.requestToken();
                }, expires_in * 1000)
            });
        } catch (e) {
            if (e.status === 400) {
                return Promise.reject(new Error("Invalid Spotify client."));
            }
            await this.requestToken();
        }
    }
}
