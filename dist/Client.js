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
class Client {
    constructor(options, nodesOpt) {
        this.options = options;
        this.baseURL = "https://api.spotify.com/v1";
        this.nodes = new Map();
        this.token = null;
        this.spotifyPattern = /^(?:https:\/\/open\.spotify\.com\/(?:user\/[A-Za-z0-9]+\/)?|spotify:)(album|playlist|track)(?:[/:])([A-Za-z0-9]+).*$/;
        for (const nodeOpt of nodesOpt)
            this.addNode(nodeOpt);
    }
    addNode(options) {
        this.nodes.set(options.id, new Node_1.default(this, options));
    }
    getNode(id) {
        return this.nodes.get(id);
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
exports.default = Client;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUNBLHNFQUFzQztBQUN0Qyw2REFBcUM7QUFFckMsTUFBcUIsTUFBTTtJQU92QixZQUEwQixPQUFzQixFQUFFLFFBQXVCO1FBQS9DLFlBQU8sR0FBUCxPQUFPLENBQWU7UUFOaEMsWUFBTyxHQUFHLDRCQUE0QixDQUFDO1FBQ2hELFVBQUssR0FBRyxJQUFJLEdBQUcsRUFBZ0IsQ0FBQztRQUNoQyxVQUFLLEdBQWtCLElBQUksQ0FBQztRQUM1QixtQkFBYyxHQUFHLHNIQUFzSCxDQUFDO1FBSTNJLEtBQUssTUFBTSxPQUFPLElBQUksUUFBUTtZQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVNLE9BQU8sQ0FBQyxPQUFvQjtRQUMvQixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLElBQUksY0FBSSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFTSxPQUFPLENBQUMsRUFBVTtRQUNyQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFTSxVQUFVLENBQUMsR0FBVztRQUN6QixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFWSxZQUFZOztZQUNyQixJQUFJLElBQUksQ0FBQyxXQUFXO2dCQUFFLE9BQU87WUFFN0IsSUFBSTtnQkFDQSxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsRUFBRSxHQUFRLE1BQU0seUJBQU87cUJBQ3hFLElBQUksQ0FBQyx3Q0FBd0MsQ0FBQztxQkFDOUMsR0FBRyxDQUFDO29CQUNELGFBQWEsRUFBRSxTQUFTLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFO29CQUNqSCxjQUFjLEVBQUUsbUNBQW1DO2lCQUN0RCxDQUFDO3FCQUNELElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO2dCQUUzQyxJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsVUFBVSxJQUFJLFlBQVksRUFBRSxDQUFDO2dCQUM3QyxJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEVBQUU7b0JBQy9CLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztvQkFDeEIsS0FBSyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7Z0JBQzdCLENBQUMsRUFBRSxVQUFVLEdBQUcsSUFBSSxDQUFDLENBQUM7YUFDekI7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDUixJQUFJLENBQUMsQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFO29CQUNsQixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDO2lCQUMvRDtnQkFDRCxNQUFNLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQzthQUM3QjtRQUNMLENBQUM7S0FBQTtDQUNKO0FBL0NELHlCQStDQyJ9