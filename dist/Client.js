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
    filterAudioOnlyResult: true
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUNBLHNFQUFzQztBQUN0Qyw2REFBcUM7QUFFckMsTUFBTSxvQkFBb0IsR0FBa0I7SUFDeEMsUUFBUSxFQUFFLEVBQUU7SUFDWixZQUFZLEVBQUUsRUFBRTtJQUNoQixxQkFBcUIsRUFBRSxDQUFDO0lBQ3hCLHFCQUFxQixFQUFFLElBQUk7Q0FDOUIsQ0FBQztBQUVGLE1BQXFCLGFBQWE7SUFROUIsWUFBbUIsT0FBc0IsRUFBRSxRQUF1QjtRQVBsRCxZQUFPLEdBQUcsNEJBQTRCLENBQUM7UUFFaEQsVUFBSyxHQUFHLElBQUksR0FBRyxFQUFnQixDQUFDO1FBQ2hDLFVBQUssR0FBa0IsSUFBSSxDQUFDO1FBQzVCLG1CQUFjLEdBQUcsc0hBQXNILENBQUM7UUFJM0ksSUFBSSxDQUFDLE9BQU8sbUNBQVEsb0JBQW9CLEdBQUssT0FBTyxDQUFFLENBQUM7UUFDdkQsS0FBSyxNQUFNLE9BQU8sSUFBSSxRQUFRO1lBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRU0sT0FBTyxDQUFDLE9BQW9CO1FBQy9CLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsSUFBSSxjQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVNLFVBQVUsQ0FBQyxHQUFXO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVZLFlBQVk7O1lBQ3JCLElBQUksSUFBSSxDQUFDLFdBQVc7Z0JBQUUsT0FBTztZQUU3QixJQUFJO2dCQUNBLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxFQUFFLEdBQVEsTUFBTSx5QkFBTztxQkFDeEUsSUFBSSxDQUFDLHdDQUF3QyxDQUFDO3FCQUM5QyxHQUFHLENBQUM7b0JBQ0QsYUFBYSxFQUFFLFNBQVMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUU7b0JBQ2pILGNBQWMsRUFBRSxtQ0FBbUM7aUJBQ3RELENBQUM7cUJBQ0QsSUFBSSxDQUFDLCtCQUErQixDQUFDLENBQUM7Z0JBRTNDLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxVQUFVLElBQUksWUFBWSxFQUFFLENBQUM7Z0JBQzdDLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDLEdBQUcsRUFBRTtvQkFDL0IsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO29CQUN4QixLQUFLLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDN0IsQ0FBQyxFQUFFLFVBQVUsR0FBRyxJQUFJLENBQUMsQ0FBQzthQUN6QjtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNSLElBQUksQ0FBQyxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUU7b0JBQ2xCLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUM7aUJBQy9EO2dCQUNELE1BQU0sSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO2FBQzdCO1FBQ0wsQ0FBQztLQUFBO0NBQ0o7QUE3Q0QsZ0NBNkNDIn0=