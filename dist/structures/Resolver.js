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
const Util_1 = __importDefault(require("../Util"));
class Resolver {
    constructor(node) {
        this.node = node;
        this.client = this.node.client;
    }
    get token() {
        return this.client.token;
    }
    get playlistPageLoadLimit() {
        var _a;
        return this.client.options.playlistPageLoadLimit === 0
            ? Infinity
            : (_a = this.client.options.playlistPageLoadLimit) !== null && _a !== void 0 ? _a : 2;
    }
    getAlbum(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const album = yield Util_1.default.tryPromise(() => __awaiter(this, void 0, void 0, function* () {
                return (yield node_superfetch_1.default
                    .get(`${this.client.baseURL}/albums/${id}`)
                    .set("Authorization", this.token)).body;
            }));
            return {
                loadType: album ? "PLAYLIST_LOADED" : "NO_MATCHES",
                playlistInfo: {
                    name: album === null || album === void 0 ? void 0 : album.name
                },
                tracks: album
                    ? (yield Promise.all(album.tracks.items.map(x => this.resolve(x)))).filter(Boolean)
                    : []
            };
        });
    }
    getPlaylist(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const playlist = yield Util_1.default.tryPromise(() => __awaiter(this, void 0, void 0, function* () {
                return (yield node_superfetch_1.default
                    .get(`${this.client.baseURL}/playlists/${id}`)
                    .set("Authorization", this.token)).body;
            }));
            const playlistTracks = playlist ? yield this.getPlaylistTracks(playlist) : [];
            return {
                loadType: playlist ? "PLAYLIST_LOADED" : "NO_MATCHES",
                playlistInfo: {
                    name: playlist === null || playlist === void 0 ? void 0 : playlist.name
                },
                tracks: (yield Promise.all(playlistTracks.map(x => this.resolve(x.track)))).filter(Boolean)
            };
        });
    }
    getTrack(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const track = yield Util_1.default.tryPromise(() => __awaiter(this, void 0, void 0, function* () {
                return (yield node_superfetch_1.default
                    .get(`${this.client.baseURL}/tracks/${id}`)
                    .set("Authorization", this.token)).body;
            }));
            return {
                loadType: track ? "TRACK_LOADED" : "NO_MATCHES",
                playlistInfo: {},
                tracks: track ? [(yield this.resolve(track))] : []
            };
        });
    }
    getPlaylistTracks(playlist, currPage = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!playlist.tracks.next || currPage >= this.playlistPageLoadLimit)
                return playlist.tracks.items;
            currPage++;
            const { body } = yield node_superfetch_1.default
                .get(playlist.tracks.next)
                .set("Authorization", this.token);
            const { items, next } = body;
            const mergedPlaylistTracks = playlist.tracks.items.concat(items);
            if (next && currPage < this.playlistPageLoadLimit)
                return this.getPlaylistTracks({
                    tracks: {
                        items: mergedPlaylistTracks,
                        next
                    }
                }, currPage);
            else
                return mergedPlaylistTracks;
        });
    }
    resolve(track) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = new URLSearchParams({
                    identifier: `ytsearch:${track.artists[0].name} - ${track.name}`
                }).toString();
                // @ts-expect-error 2322
                const { body } = yield node_superfetch_1.default
                    .get(`http://${this.node.options.host}:${this.node.options.port}/loadtracks?${params}`)
                    .set("Authorization", this.node.options.password);
                return body.exception ? undefined : body.tracks[0];
            }
            catch (_a) {
                return undefined;
            }
        });
    }
}
exports.default = Resolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlcy9SZXNvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUNBLHNFQUFzQztBQUV0QyxtREFBMkI7QUFFM0IsTUFBcUIsUUFBUTtJQUd6QixZQUEwQixJQUFVO1FBQVYsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUY3QixXQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7SUFFTSxDQUFDO0lBRXhDLElBQVcsS0FBSztRQUNaLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFNLENBQUM7SUFDOUIsQ0FBQztJQUVELElBQVcscUJBQXFCOztRQUM1QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHFCQUFxQixLQUFLLENBQUM7WUFDbEQsQ0FBQyxDQUFDLFFBQVE7WUFDVixDQUFDLE9BQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMscUJBQXFCLG1DQUFJLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRVksUUFBUSxDQUFDLEVBQVU7O1lBQzVCLE1BQU0sS0FBSyxHQUFHLE1BQU0sY0FBSSxDQUFDLFVBQVUsQ0FBQyxHQUFTLEVBQUU7Z0JBQzNDLE9BQU8sQ0FBQyxNQUFNLHlCQUFPO3FCQUNoQixHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sV0FBVyxFQUFFLEVBQUUsQ0FBQztxQkFDMUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFvQixDQUFDO1lBQ2hFLENBQUMsQ0FBQSxDQUFDLENBQUM7WUFFSCxPQUFPO2dCQUNILFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxZQUFZO2dCQUNsRCxZQUFZLEVBQUU7b0JBQ1YsSUFBSSxFQUFFLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxJQUFJO2lCQUNwQjtnQkFDRCxNQUFNLEVBQUUsS0FBSztvQkFDVCxDQUFDLENBQUMsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFvQjtvQkFDdEcsQ0FBQyxDQUFDLEVBQUU7YUFDWCxDQUFDO1FBQ04sQ0FBQztLQUFBO0lBRVksV0FBVyxDQUFDLEVBQVU7O1lBQy9CLE1BQU0sUUFBUSxHQUFHLE1BQU0sY0FBSSxDQUFDLFVBQVUsQ0FBQyxHQUFTLEVBQUU7Z0JBQzlDLE9BQU8sQ0FBQyxNQUFNLHlCQUFPO3FCQUNoQixHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sY0FBYyxFQUFFLEVBQUUsQ0FBQztxQkFDN0MsR0FBRyxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUF1QixDQUFDO1lBQ25FLENBQUMsQ0FBQSxDQUFDLENBQUM7WUFFSCxNQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFFOUUsT0FBTztnQkFDSCxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsWUFBWTtnQkFDckQsWUFBWSxFQUFFO29CQUNWLElBQUksRUFBRSxRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUUsSUFBSTtpQkFDdkI7Z0JBQ0QsTUFBTSxFQUFFLENBQUMsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFvQjthQUNqSCxDQUFDO1FBQ04sQ0FBQztLQUFBO0lBRVksUUFBUSxDQUFDLEVBQVU7O1lBQzVCLE1BQU0sS0FBSyxHQUFHLE1BQU0sY0FBSSxDQUFDLFVBQVUsQ0FBQyxHQUFTLEVBQUU7Z0JBQzNDLE9BQU8sQ0FBQyxNQUFNLHlCQUFPO3FCQUNoQixHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sV0FBVyxFQUFFLEVBQUUsQ0FBQztxQkFDMUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFvQixDQUFDO1lBQ2hFLENBQUMsQ0FBQSxDQUFDLENBQUM7WUFFSCxPQUFPO2dCQUNILFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsWUFBWTtnQkFDL0MsWUFBWSxFQUFFLEVBQUU7Z0JBQ2hCLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2FBQ3RELENBQUM7UUFDTixDQUFDO0tBQUE7SUFFYSxpQkFBaUIsQ0FBQyxRQUsvQixFQUFFLFFBQVEsR0FBRyxDQUFDOztZQUNYLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxRQUFRLElBQUksSUFBSSxDQUFDLHFCQUFxQjtnQkFBRSxPQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ2xHLFFBQVEsRUFBRSxDQUFDO1lBRVgsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFRLE1BQU0seUJBQU87aUJBQzlCLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztpQkFDekIsR0FBRyxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFdEMsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsR0FBbUUsSUFBSSxDQUFDO1lBRTdGLE1BQU0sb0JBQW9CLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRWpFLElBQUksSUFBSSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMscUJBQXFCO2dCQUFFLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDO29CQUM3RSxNQUFNLEVBQUU7d0JBQ0osS0FBSyxFQUFFLG9CQUFvQjt3QkFDM0IsSUFBSTtxQkFDUDtpQkFDSixFQUFFLFFBQVEsQ0FBQyxDQUFDOztnQkFDUixPQUFPLG9CQUFvQixDQUFDO1FBQ3JDLENBQUM7S0FBQTtJQUVhLE9BQU8sQ0FBQyxLQUFtQjs7WUFDckMsSUFBSTtnQkFDQSxNQUFNLE1BQU0sR0FBRyxJQUFJLGVBQWUsQ0FBQztvQkFDL0IsVUFBVSxFQUFFLFlBQVksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLE1BQU0sS0FBSyxDQUFDLElBQUksRUFBRTtpQkFDbEUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUVkLHdCQUF3QjtnQkFDeEIsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFvQyxNQUFNLHlCQUFPO3FCQUMxRCxHQUFHLENBQUMsVUFBVSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxlQUFlLE1BQU0sRUFBRSxDQUFDO3FCQUN0RixHQUFHLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUV0RCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN0RDtZQUFDLFdBQU07Z0JBQ0osT0FBTyxTQUFTLENBQUM7YUFDcEI7UUFDTCxDQUFDO0tBQUE7Q0FDSjtBQTNHRCwyQkEyR0MifQ==