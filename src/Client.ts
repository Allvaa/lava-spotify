import { ClientOptions, NodeOptions } from "./typings";
import request from "node-superfetch";
import Node from "./structures/Node";
import Util from "./Util";
import { DefaultClientOptions } from "./Constants";

export default class LavasfyClient {
    public readonly baseURL!: string;
    public options: Readonly<ClientOptions>;
    public nodes = new Map<string, Node>();
    public token!: string | null;
    public spotifyPattern!: RegExp;
    private nextRequest?: NodeJS.Timeout;

    public constructor(options: ClientOptions, nodesOpt: NodeOptions[]) {
        Object.defineProperties(this, {
            baseURL: {
                value: "https://api.spotify.com/v1",
                configurable: false,
                enumerable: true,
                writable: false
            },
            token: {
                value: null,
                configurable: true
            },
            spotifyPattern: {
                value: /^(?:https:\/\/open\.spotify\.com\/(?:user\/[A-Za-z0-9]+\/)?|spotify:)(album|playlist|track)(?:[/:])([A-Za-z0-9]+).*$/
            }
        });

        this.options = Object.freeze(Util.mergeDefault(DefaultClientOptions, options));
        for (const nodeOpt of nodesOpt) this.addNode(nodeOpt);
    }

    public addNode(options: NodeOptions): void {
        this.nodes.set(options.id, new Node(this, options));
    }

    public isValidURL(url: string): boolean {
        return this.spotifyPattern.test(url);
    }

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

            Object.defineProperty(this, "token", { value: `${token_type} ${access_token}`, configurable: true });
            Object.defineProperty(this, "nextRequest", {
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
