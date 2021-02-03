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
        this.cache = new Map();
    }
    get token() {
        return this.client.token;
    }
    get playlistPageLoadLimit() {
        return this.client.options.playlistPageLoadLimit === 0
            ? Infinity
            : this.client.options.playlistPageLoadLimit;
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
            const cached = this.cache.get(track.id);
            if (cached)
                return Util_1.default.structuredClone(cached);
            try {
                const params = new URLSearchParams({
                    identifier: `ytsearch:${track.artists[0].name} - ${track.name} ${this.client.options.filterAudioOnlyResult ? "description:(\"Auto-generated by YouTube.\")" : ""}`
                }).toString();
                // @ts-expect-error 2322
                const { body } = yield node_superfetch_1.default
                    .get(`http://${this.node.options.host}:${this.node.options.port}/loadtracks?${params}`)
                    .set("Authorization", this.node.options.password);
                if (body.tracks.length)
                    this.cache.set(track.id, Object.freeze(body.tracks[0]));
                return Util_1.default.structuredClone(body.tracks[0]);
            }
            catch (_a) {
                return undefined;
            }
        });
    }
}
exports.default = Resolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlcy9SZXNvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUNBLHNFQUFzQztBQUV0QyxtREFBMkI7QUFFM0IsTUFBcUIsUUFBUTtJQUl6QixZQUEwQixJQUFVO1FBQVYsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUg3QixXQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDMUIsVUFBSyxHQUFHLElBQUksR0FBRyxFQUF5QixDQUFDO0lBRVQsQ0FBQztJQUV4QyxJQUFXLEtBQUs7UUFDWixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBTSxDQUFDO0lBQzlCLENBQUM7SUFFRCxJQUFXLHFCQUFxQjtRQUM1QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHFCQUFxQixLQUFLLENBQUM7WUFDbEQsQ0FBQyxDQUFDLFFBQVE7WUFDVixDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMscUJBQXNCLENBQUM7SUFDckQsQ0FBQztJQUVZLFFBQVEsQ0FBQyxFQUFVOztZQUM1QixNQUFNLEtBQUssR0FBRyxNQUFNLGNBQUksQ0FBQyxVQUFVLENBQUMsR0FBUyxFQUFFO2dCQUMzQyxPQUFPLENBQUMsTUFBTSx5QkFBTztxQkFDaEIsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLFdBQVcsRUFBRSxFQUFFLENBQUM7cUJBQzFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBb0IsQ0FBQztZQUNoRSxDQUFDLENBQUEsQ0FBQyxDQUFDO1lBRUgsT0FBTztnQkFDSCxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsWUFBWTtnQkFDbEQsWUFBWSxFQUFFO29C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