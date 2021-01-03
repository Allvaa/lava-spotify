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
class Client {
    constructor(options) {
        this.options = options;
        this.baseURL = "https://api.spotify.com/v1";
        this.token = null;
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
                if (e.status == 400) {
                    return Promise.reject(new Error("Invalid Spotify client."));
                }
                yield this.requestToken();
            }
        });
    }
}
exports.default = Client;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUNBLHNFQUFzQztBQUV0QyxNQUFxQixNQUFNO0lBS3ZCLFlBQTBCLE9BQXNCO1FBQXRCLFlBQU8sR0FBUCxPQUFPLENBQWU7UUFKaEMsWUFBTyxHQUFHLDRCQUE0QixDQUFDO1FBQ2hELFVBQUssR0FBa0IsSUFBSSxDQUFDO0lBR2dCLENBQUM7SUFFdkMsWUFBWTs7WUFDckIsSUFBSSxJQUFJLENBQUMsV0FBVztnQkFBRSxPQUFPO1lBRTdCLElBQUk7Z0JBQ0EsTUFBTSxFQUFFLElBQUksRUFBRSxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLEVBQUUsR0FBUSxNQUFNLHlCQUFPO3FCQUN4RSxJQUFJLENBQUMsd0NBQXdDLENBQUM7cUJBQzlDLEdBQUcsQ0FBQztvQkFDRCxhQUFhLEVBQUUsU0FBUyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRTtvQkFDakgsY0FBYyxFQUFFLG1DQUFtQztpQkFDdEQsQ0FBQztxQkFDRCxJQUFJLENBQUMsK0JBQStCLENBQUMsQ0FBQztnQkFFM0MsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLFVBQVUsSUFBSSxZQUFZLEVBQUUsQ0FBQztnQkFDN0MsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUMsR0FBRyxFQUFFO29CQUMvQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7b0JBQ3hCLEtBQUssSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUM3QixDQUFDLEVBQUUsVUFBVSxHQUFHLElBQUksQ0FBQyxDQUFDO2FBQ3pCO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1IsSUFBSSxDQUFDLENBQUMsTUFBTSxJQUFJLEdBQUcsRUFBRTtvQkFDakIsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQztpQkFDL0Q7Z0JBQ0QsTUFBTSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7YUFDN0I7UUFDTCxDQUFDO0tBQUE7Q0FDSjtBQS9CRCx5QkErQkMifQ==