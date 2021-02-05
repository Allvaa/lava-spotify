"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_superfetch_1 = __importDefault(require("node-superfetch"));
const Node_1 = __importDefault(require("./structures/Node"));
const defaultClientOptions = {
    clientID: "",
    clientSecret: "",
    playlistPageLoadLimit: 2,
    filterAudioOnlyResult: true,
    alwaysUseYTMusic: false
};
class LavasfyClient {
    constructor(options, nodesOpt) {
        this.baseURL = "https://api.spotify.com/v1";
        this.nodes = new Map();
        this.token = null;
        this.spotifyPattern = /^(?:https:\/\/open\.spotify\.com\/(?:user\/[A-Za-z0-9]+\/)?|spotify:)(album|playlist|track)(?:[/:])([A-Za-z0-9]+).*$/;
        this.options = Object.assign(Object.assign({}, defaultClientOptions), options);
        for (const nodeOpt of nodesOpt)
            this.addNode(nodeOpt);
    }
    addNode(options) {
        this.nodes.set(options.id, new Node_1.default(this, options));
    }
    isValidURL(url) {
        return this.spotifyPattern.test(url);
    }
    requestToken() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.nextRequest)
                return;
            try {
                const { body: { access_token, token_type, expires_in } } = yield node_superfetch_1.default
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
                yield this.requestToken();
            }
        });
    }
}
exports.default = LavasfyClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUNBLHNFQUFzQztBQUN0Qyw2REFBcUM7QUFFckMsTUFBTSxvQkFBb0IsR0FBa0I7SUFDeEMsUUFBUSxFQUFFLEVBQUU7SUFDWixZQUFZLEVBQUUsRUFBRTtJQUNoQixxQkFBcUIsRUFBRSxDQUFDO0lBQ3hCLHFCQUFxQixFQUFFLElBQUk7SUFDM0IsZ0JBQWdCLEVBQUUsS0FBSztDQUMxQixDQUFDO0FBRUYsTUFBcUIsYUFBYTtJQVE5QixZQUFtQixPQUFzQixFQUFFLFFBQXVCO1FBUGxELFlBQU8sR0FBRyw0QkFBNEIsQ0FBQztRQUVoRCxVQUFLLEdBQUcsSUFBSSxHQUFHLEVBQWdCLENBQUM7UUFDaEMsVUFBSyxHQUFrQixJQUFJLENBQUM7UUFDNUIsbUJBQWMsR0FBRyxzSEFBc0gsQ0FBQztRQUkzSSxJQUFJLENBQUMsT0FBTyxtQ0FBUSxvQkFBb0IsR0FBSyxPQUFPLENBQUUsQ0FBQztRQUN2RCxLQUFLLE1BQU0sT0FBTyxJQUFJLFFBQVE7WUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFTSxPQUFPLENBQUMsT0FBb0I7UUFDL0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxJQUFJLGNBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRU0sVUFBVSxDQUFDLEdBQVc7UUFDekIsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRVksWUFBWTs7WUFDckIsSUFBSSxJQUFJLENBQUMsV0FBVztnQkFBRSxPQUFPO1lBRTdCLElBQUk7Z0JBQ0EsTUFBTSxFQUFFLElBQUksRUFBRSxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLEVBQUUsR0FBUSxNQUFNLHlCQUFPO3FCQUN4RSxJQUFJLENBQUMsd0NBQXdDLENBQUM7cUJBQzlDLEdBQUcsQ0FBQztvQkFDRCxhQUFhLEVBQUUsU0FBUyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRTtvQkFDakgsY0FBYyxFQUFFLG1DQUFtQztpQkFDdEQsQ0FBQztxQkFDRCxJQUFJLENBQUMsK0JBQStCLENBQUMsQ0FBQztnQkFFM0MsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLFVBQVUsSUFBSSxZQUFZLEVBQUUsQ0FBQztnQkFDN0MsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUMsR0FBRyxFQUFFO29CQUMvQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7b0JBQ3hCLEtBQUssSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUM3QixDQUFDLEVBQUUsVUFBVSxHQUFHLElBQUksQ0FBQyxDQUFDO2FBQ3pCO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1IsSUFBSSxDQUFDLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRTtvQkFDbEIsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQztpQkFDL0Q7Z0JBQ0QsTUFBTSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7YUFDN0I7UUFDTCxDQUFDO0tBQUE7Q0FDSjtBQTdDRCxnQ0E2Q0MifQ==