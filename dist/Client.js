"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_superfetch_1 = __importDefault(require("node-superfetch"));
const Node_1 = __importDefault(require("./structures/Node"));
const Util_1 = __importDefault(require("./Util"));
const Constants_1 = require("./Constants");
class LavasfyClient {
    constructor(options, nodesOpt) {
        /** The {@link Node}s are stored here */
        this.nodes = new Map();
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
        this.options = Object.freeze(Util_1.default.mergeDefault(Constants_1.DefaultClientOptions, options));
        for (const nodeOpt of nodesOpt)
            this.addNode(nodeOpt);
    }
    addNode(options) {
        this.nodes.set(options.id, new Node_1.default(this, options));
    }
    removeNode(query) {
        if (!this.nodes.size)
            throw new TypeError("No nodes available, please add a node first...");
        if (!query)
            throw new TypeError("Provide a valid node identifier to delete it");
        if (query && this.nodes.has(query))
            return this.nodes.delete(query);
        else
            return false;
    }
    getNode(query) {
        if (!this.nodes.size)
            throw new TypeError("No nodes available, please add a node first...");
        if (!query)
            return [...this.nodes.values()].sort(() => 0.5 - Math.random())[0];
        if (query && this.nodes.has(query))
            return this.nodes.get(query);
    }
    /** Determine the URL is a valid Spotify URL or not */
    isValidURL(url) {
        return this.spotifyPattern.test(url);
    }
    /** A method to retrieve the Spotify API token. (this method must be invoked) */
    async requestToken() {
        if (this.nextRequest)
            return;
        try {
            const { body: { access_token, token_type, expires_in } } = await node_superfetch_1.default
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
        }
        catch (e) {
            if (e.status === 400) {
                return Promise.reject(new Error("Invalid Spotify client."));
            }
            await this.requestToken();
        }
    }
}
exports.default = LavasfyClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLHNFQUFzQztBQUN0Qyw2REFBcUM7QUFDckMsa0RBQTBCO0FBQzFCLDJDQUFtRDtBQUVuRCxNQUFxQixhQUFhO0lBYzlCLFlBQW1CLE9BQXNCLEVBQUUsUUFBdUI7UUFYbEUsd0NBQXdDO1FBQ2pDLFVBQUssR0FBRyxJQUFJLEdBQUcsRUFBZ0IsQ0FBQztRQVduQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDbkMsVUFBVSxFQUFFLElBQUk7WUFDaEIsS0FBSyxFQUFFLDRCQUE0QjtTQUN0QyxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtZQUMxQyxLQUFLLEVBQUUsc0hBQXNIO1NBQ2hJLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRTtZQUNqQyxZQUFZLEVBQUUsSUFBSTtZQUNsQixLQUFLLEVBQUUsSUFBSTtTQUNkLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFJLENBQUMsWUFBWSxDQUFDLGdDQUFvQixFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDL0UsS0FBSyxNQUFNLE9BQU8sSUFBSSxRQUFRO1lBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRU0sT0FBTyxDQUFDLE9BQW9CO1FBQy9CLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsSUFBSSxjQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVNLFVBQVUsQ0FBQyxLQUFhO1FBQzNCLElBQUksQ0FBQyxJQUFJ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