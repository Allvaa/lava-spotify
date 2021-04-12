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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLHNFQUFzQztBQUN0Qyw2REFBcUM7QUFDckMsa0RBQTBCO0FBQzFCLDJDQUFtRDtBQUVuRCxNQUFxQixhQUFhO0lBUzlCLFlBQW1CLE9BQXNCLEVBQUUsUUFBdUI7UUFQM0QsVUFBSyxHQUFHLElBQUksR0FBRyxFQUFnQixDQUFDO1FBUW5DLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtZQUNuQyxVQUFVLEVBQUUsSUFBSTtZQUNoQixLQUFLLEVBQUUsNEJBQTRCO1NBQ3RDLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFO1lBQzFDLEtBQUssRUFBRSxzSEFBc0g7U0FDaEksQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFO1lBQ2pDLFlBQVksRUFBRSxJQUFJO1lBQ2xCLEtBQUssRUFBRSxJQUFJO1NBQ2QsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLGNBQUksQ0FBQyxZQUFZLENBQUMsZ0NBQW9CLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUMvRSxLQUFLLE1BQU0sT0FBTyxJQUFJLFFBQVE7WUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFTSxPQUFPLENBQUMsT0FBb0I7UUFDL0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxJQUFJLGNBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRU0sVUFBVSxDQUFDLEdBQVc7UUFDekIsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRU0sS0FBSyxDQUFDLFlBQVk7UUFDckIsSUFBSSxJQUFJLENBQUMsV0FBVztZQUFFLE9BQU87UUFFN0IsSUFBSTtZQUNBLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxFQUFFLEdBQVEsTUFBTSx5QkFBTztpQkFDeEUsSUFBSSxDQUFDLHdDQUF3QyxDQUFDO2lCQUM5QyxHQUFHLENBQUM7Z0JBQ0QsYUFBYSxFQUFFLFNBQVMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQ2pILGNBQWMsRUFBRSxtQ0FBbUM7YUFDdEQsQ0FBQztpQkFDRCxJQUFJLENBQUMsK0JBQStCLENBQUMsQ0FBQztZQUUzQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxVQUFVLElBQUksWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ2pGLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtnQkFDdkMsWUFBWSxFQUFFLElBQUk7Z0JBQ2xCLEtBQUssRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFO29CQUNuQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7b0JBQ3hCLEtBQUssSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUM3QixDQUFDLEVBQUUsVUFBVSxHQUFHLElBQUksQ0FBQzthQUN4QixDQUFDLENBQUM7U0FDTjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1IsSUFBSSxDQUFDLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRTtnQkFDbEIsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQzthQUMvRDtZQUNELE1BQU0sSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1NBQzdCO0lBQ0wsQ0FBQztDQUNKO0FBN0RELGdDQTZEQyJ9