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
const node_fetch_1 = __importDefault(require("node-fetch"));
const spotifyPattern = /(?:https:\/\/open\.spotify\.com\/|spotify:)(album|playlist|track)(?:[/:])([A-Za-z0-9]+)/;
class LavaSpotify {
    constructor(node, options) {
        this.node = node;
        this.options = options;
        this.baseURL = "https://api.spotify.com/v1";
        this.token = null;
    }
    load(url) {
        var _a;
        const typeFuncs = {
            album: this.getAlbum.bind(this),
            playlist: this.getPlaylist.bind(this),
            track: this.getTrack.bind(this)
        };
        const [, type, id] = (_a = spotifyPattern.exec(url)) !== null && _a !== void 0 ? _a : [];
        return typeFuncs[type](id, true);
    }
    getAlbum(id, asLavaTrack = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const album = yield (yield node_fetch_1.default(`${this.baseURL}/albums/${id}`, {
                headers: {
                    Authorization: this.token
                }
            })).json();
            return asLavaTrack ? {
                loadType: "PLAYLIST_LOADED",
                playlistInfo: {
                    name: album.name
                },
                tracks: yield Promise.all(album.tracks.items.map(x => this.resolve(x)))
            } : album;
        });
    }
    getPlaylist(id, asLavaTrack = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const playlist = yield (yield node_fetch_1.default(`${this.baseURL}/playlists/${id}`, {
                headers: {
                    Authorization: this.token
                }
            })).json();
            return asLavaTrack ? {
                loadType: "PLAYLIST_LOADED",
                playlistInfo: {
                    name: playlist.name
                },
                tracks: yield Promise.all(playlist.tracks.items.map(x => this.resolve(x)))
            } : playlist;
        });
    }
    getTrack(id, asLavaTrack = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const track = yield (yield node_fetch_1.default(`${this.baseURL}/tracks/${id}`, {
                headers: {
                    Authorization: this.token
                }
            })).json();
            return asLavaTrack ? {
                loadType: "TRACK_LOADED",
                playlistInfo: {},
                tracks: [yield this.resolve(track)]
            } : track;
        });
    }
    resolve(track) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = new URLSearchParams({
                identifier: `ytsearch:${track.artists[0].name} - ${track.name}`
            }).toString();
            return (yield (yield node_fetch_1.default(`http://${this.node.host}:${this.node.port}/loadtracks?${params}`, {
                headers: {
                    Authorization: this.node.password
                }
            })).json()).tracks[0];
        });
    }
    requestToken() {
        return __awaiter(this, void 0, void 0, function* () {
            clearTimeout(this.nextRequest);
            delete this.nextRequest;
            const auth = Buffer.from(`${this.options.clientID}:${this.options.clientSecret}`).toString("base64");
            const { access_token, token_type, expires_in } = yield (yield node_fetch_1.default("https://accounts.spotify.com/api/token", {
                method: "POST",
                body: "grant_type=client_credentials",
                headers: {
                    Authorization: `Basic ${auth}`,
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })).json();
            this.token = `${token_type} ${access_token}`;
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            this.nextRequest = setTimeout(this.requestToken.bind(this), expires_in * 1000);
        });
    }
}
exports.default = LavaSpotify;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGF2YVNwb3RpZnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2xhc3Nlcy9MYXZhU3BvdGlmeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUNBLDREQUErQjtBQUUvQixNQUFNLGNBQWMsR0FBRyx5RkFBeUYsQ0FBQztBQUVqSCxNQUFxQixXQUFXO0lBSzVCLFlBQTBCLElBQWtCLEVBQVMsT0FBdUI7UUFBbEQsU0FBSSxHQUFKLElBQUksQ0FBYztRQUFTLFlBQU8sR0FBUCxPQUFPLENBQWdCO1FBSjNELFlBQU8sR0FBRyw0QkFBNEIsQ0FBQztRQUNoRCxVQUFLLEdBQWtCLElBQUksQ0FBQztJQUcyQyxDQUFDO0lBRXpFLElBQUksQ0FBQyxHQUFXOztRQUNuQixNQUFNLFNBQVMsR0FBRztZQUNkLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDL0IsUUFBUSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNyQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1NBQ2xDLENBQUM7UUFDRixNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLFNBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsbUNBQUksRUFBRSxDQUFDO1FBQ3BELE9BQU8sU0FBUyxDQUFDLElBQThCLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFtQyxDQUFDO0lBQ2pHLENBQUM7SUFLWSxRQUFRLENBQUMsRUFBVSxFQUFFLFdBQVcsR0FBRyxLQUFLOztZQUNqRCxNQUFNLEtBQUssR0FBaUIsTUFBTSxDQUFDLE1BQU0sb0JBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLFdBQVcsRUFBRSxFQUFFLEVBQUU7Z0JBQzNFLE9BQU8sRUFBRTtvQkFDTCxhQUFhLEVBQUUsSUFBSSxDQUFDLEtBQU07aUJBQzdCO2FBQ0osQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFWCxPQUFPLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLFFBQVEsRUFBRSxpQkFBaUI7Z0JBQzNCLFlBQVksRUFBRTtvQkFDVixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7aUJBQ25CO2dCQUNELE1BQU0sRUFBRSxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzFFLENBQUEsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNiLENBQUM7S0FBQTtJQUtZLFdBQVcsQ0FBQyxFQUFVLEVBQUUsV0FBVyxHQUFHLEtBQUs7O1lBQ3BELE1BQU0sUUFBUSxHQUFvQixNQUFNLENBQUMsTUFBTSxvQkFBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sY0FBYyxFQUFFLEVBQUUsRUFBRTtnQkFDcEYsT0FBTyxFQUFFO29CQUNMLGFBQWEsRUFBRSxJQUFJLENBQUMsS0FBTTtpQkFDN0I7YUFDSixDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUVYLE9BQU8sV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDakIsUUFBUSxFQUFFLGlCQUFpQjtnQkFDM0IsWUFBWSxFQUFFO29CQUNWLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSTtpQkFDdEI7Z0JBQ0QsTUFBTSxFQUFFLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDN0UsQ0FBQSxDQUFDLENBQUMsUUFBUSxDQUFDO1FBQ2hCLENBQUM7S0FBQTtJQUtZLFFBQVEsQ0FBQyxFQUFVLEVBQUUsV0FBVyxHQUFHLEtBQUs7O1lBQ2pELE1BQU0sS0FBSyxHQUFpQixNQUFNLENBQUMsTUFBTSxvQkFBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sV0FBVyxFQUFFLEVBQUUsRUFBRTtnQkFDM0UsT0FBTyxFQUFFO29CQUNMLGFBQWEsRUFBRSxJQUFJLENBQUMsS0FBTTtpQkFDN0I7YUFDSixDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUVYLE9BQU8sV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDakIsUUFBUSxFQUFFLGNBQWM7Z0JBQ3hCLFlBQVksRUFBRSxFQUFFO2dCQUNoQixNQUFNLEVBQUUsQ0FBQyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDdEMsQ0FBQSxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ2IsQ0FBQztLQUFBO0lBRWEsT0FBTyxDQUFDLEtBQW1COztZQUNyQyxNQUFNLE1BQU0sR0FBRyxJQUFJLGVBQWUsQ0FBQztnQkFDL0IsVUFBVSxFQUFFLFlBQVksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLE1BQU0sS0FBSyxDQUFDLElBQUksRUFBRTthQUNsRSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7WUFFZCxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sb0JBQUssQ0FBQyxVQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxlQUFlLE1BQU0sRUFBRSxFQUFFO2dCQUMxRixPQUFPLEVBQUU7b0JBQ0wsYUFBYSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUTtpQkFDcEM7YUFDSixDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQWtCLENBQUM7UUFDM0MsQ0FBQztLQUFBO0lBRVksWUFBWTs7WUFDckIsWUFBWSxDQUFDLElBQUksQ0FBQyxXQUFZLENBQUMsQ0FBQztZQUNoQyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7WUFFeEIsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFckcsTUFBTSxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLEdBQUcsTUFBTSxDQUFDLE1BQU0sb0JBQUssQ0FBQyx3Q0FBd0MsRUFBRTtnQkFDMUcsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsSUFBSSxFQUFFLCtCQUErQjtnQkFDckMsT0FBTyxFQUFFO29CQUNMLGFBQWEsRUFBRSxTQUFTLElBQUksRUFBRTtvQkFDOUIsY0FBYyxFQUFFLG1DQUFtQztpQkFDdEQ7YUFDSixDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUVYLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxVQUFVLElBQUksWUFBWSxFQUFFLENBQUM7WUFDN0Msa0VBQWtFO1lBQ2xFLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQVUsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUNuRixDQUFDO0tBQUE7Q0FDSjtBQXZHRCw4QkF1R0MifQ==