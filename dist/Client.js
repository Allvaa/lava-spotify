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
        this.baseURL = "https://api.spotify.com/v1";
        this.nodes = new Map();
        this.token = null;
        this.spotifyPattern = /^(?:https:\/\/open\.spotify\.com\/(?:user\/[A-Za-z0-9]+\/)?|spotify:)(album|playlist|track)(?:[/:])([A-Za-z0-9]+).*$/;
        this.options = Object.freeze(Util_1.default.mergeDefault(Constants_1.DefaultClientOptions, options));
        for (const nodeOpt of nodesOpt)
            this.addNode(nodeOpt);
    }
    addNode(options) {
        this.nodes.set(options.id, new Node_1.default(this, options));
    }
    isValidURL(url) {
        return this.spotifyPattern.test(url);
    }
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
            this.token = `${token_type} ${access_token}`;
            this.nextRequest = setTimeout(() => {
                delete this.nextRequest;
                void this.requestToken();
            }, expires_in * 1000);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLHNFQUFzQztBQUN0Qyw2REFBcUM7QUFDckMsa0RBQTBCO0FBQzFCLDJDQUFtRDtBQUVuRCxNQUFxQixhQUFhO0lBUTlCLFlBQW1CLE9BQXNCLEVBQUUsUUFBdUI7UUFQbEQsWUFBTyxHQUFHLDRCQUE0QixDQUFDO1FBRWhELFVBQUssR0FBRyxJQUFJLEdBQUcsRUFBZ0IsQ0FBQztRQUNoQyxVQUFLLEdBQWtCLElBQUksQ0FBQztRQUM1QixtQkFBYyxHQUFHLHNIQUFzSCxDQUFDO1FBSTNJLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFJLENBQUMsWUFBWSxDQUFDLGdDQUFvQixFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDL0UsS0FBSyxNQUFNLE9BQU8sSUFBSSxRQUFRO1lBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRU0sT0FBTyxDQUFDLE9BQW9CO1FBQy9CLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsSUFBSSxjQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVNLFVBQVUsQ0FBQyxHQUFXO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVNLEtBQUssQ0FBQyxZQUFZO1FBQ3JCLElBQUksSUFBSSxDQUFDLFdBQVc7WUFBRSxPQUFPO1FBRTdCLElBQUk7WUFDQSxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsRUFBRSxHQUFRLE1BQU0seUJBQU87aUJBQ3hFLElBQUksQ0FBQyx3Q0FBd0MsQ0FBQztpQkFDOUMsR0FBRyxDQUFDO2dCQUNELGFBQWEsRUFBRSxTQUFTLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUNqSCxjQUFjLEVBQUUsbUNBQW1DO2FBQ3RELENBQUM7aUJBQ0QsSUFBSSxDQUFDLCtCQUErQixDQUFDLENBQUM7WUFFM0MsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLFVBQVUsSUFBSSxZQUFZLEVBQUUsQ0FBQztZQUM3QyxJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQy9CLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztnQkFDeEIsS0FBSyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDN0IsQ0FBQyxFQUFFLFVBQVUsR0FBRyxJQUFJLENBQUMsQ0FBQztTQUN6QjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1IsSUFBSSxDQUFDLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRTtnQkFDbEIsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQzthQUMvRDtZQUNELE1BQU0sSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1NBQzdCO0lBQ0wsQ0FBQztDQUNKO0FBN0NELGdDQTZDQyJ9