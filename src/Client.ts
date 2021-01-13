import { ClientOptions, NodeOptions } from "./typings";
import request from "node-superfetch";
import Node from "./structures/Node";

const defaultClientOptions: ClientOptions = {
    clientID: "",
    clientSecret: "",
    playlistPageLoadLimit: 2,
    filterAudioOnlyResult: true
};

export default class Client {
    public readonly baseURL = "https://api.spotify.com/v1";
    public options: ClientOptions;
    public nodes = new Map<string, Node>();
    public token: string | null = null;
    public spotifyPattern = /^(?:https:\/\/open\.spotify\.com\/(?:user\/[A-Za-z0-9]+\/)?|spotify:)(album|playlist|track)(?:[/:])([A-Za-z0-9]+).*$/;
    private nextRequest?: NodeJS.Timeout;

    public constructor(options: ClientOptions, nodesOpt: NodeOptions[]) {
        this.options = { ...defaultClientOptions, ...options };
        for (const nodeOpt of nodesOpt) this.addNode(nodeOpt);
    }

    public addNode(options: NodeOptions): void {
        this.nodes.set(options.id, new Node(this, options));
    }

    public getNode(id: string): Node | undefined {
        return this.nodes.get(id);
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

            this.token = `${token_type} ${access_token}`;
            this.nextRequest = setTimeout(() => {
                delete this.nextRequest;
                void this.requestToken();
            }, expires_in * 1000);
        } catch (e) {
            if (e.status === 400) {
                return Promise.reject(new Error("Invalid Spotify client."));
            }
            await this.requestToken();
        }
    }
}
