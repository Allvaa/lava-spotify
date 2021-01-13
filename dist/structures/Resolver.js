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
class Resolver {
    constructor(node) {
        this.node = node;
        this.client = this.node.client;
    }
    get token() {
        return this.client.token;
    }
    getAlbum(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let album;
            try {
                album = (yield node_superfetch_1.default
                    .get(`${this.client.baseURL}/albums/${id}`)
                    .set("Authorization", this.token)).body;
            }
            catch ( /**/_a) { /**/ }
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
            let playlist;
            try {
                playlist = (yield node_superfetch_1.default
                    .get(`${this.client.baseURL}/playlists/${id}`)
                    .set("Authorization", this.token)).body;
            }
            catch ( /**/_a) { /**/ }
            return {
                loadType: playlist ? "PLAYLIST_LOADED" : "NO_MATCHES",
                playlistInfo: {
                    name: playlist === null || playlist === void 0 ? void 0 : playlist.name
                },
                tracks: playlist
                    ? (yield Promise.all(playlist.tracks.items.map(x => this.resolve(x.track)))).filter(Boolean)
                    : []
            };
        });
    }
    getTrack(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let track;
            try {
                track = (yield node_superfetch_1.default
                    .get(`${this.client.baseURL}/tracks/${id}`)
                    .set("Authorization", this.token)).body;
            }
            catch ( /**/_a) { /**/ }
            return {
                loadType: track ? "TRACK_LOADED" : "NO_MATCHES",
                playlistInfo: {},
                tracks: track ? [(yield this.resolve(track))] : []
            };
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
            catch (e) {
                console.log(e);
                return undefined;
            }
        });
    }
}
exports.default = Resolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlcy9SZXNvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUNBLHNFQUFzQztBQUd0QyxNQUFxQixRQUFRO0lBR3pCLFlBQTBCLElBQVU7UUFBVixTQUFJLEdBQUosSUFBSSxDQUFNO1FBRjdCLFdBQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUVNLENBQUM7SUFFeEMsSUFBVyxLQUFLO1FBQ1osT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQU0sQ0FBQztJQUM5QixDQUFDO0lBRVksUUFBUSxDQUFDLEVBQVU7O1lBQzVCLElBQUksS0FBK0IsQ0FBQztZQUNwQyxJQUFJO2dCQUNBLEtBQUssR0FBRyxDQUFDLE1BQU0seUJBQU87cUJBQ2pCLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxXQUFXLEVBQUUsRUFBRSxDQUFDO3FCQUMxQyxHQUFHLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQW9CLENBQUM7YUFDL0Q7WUFBQyxRQUFRLElBQUksSUFBTixFQUFFLElBQUksRUFBRTtZQUVoQixPQUFPO2dCQUNILFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxZQUFZO2dCQUNsRCxZQUFZLEVBQUU7b0JBQ1YsSUFBSSxFQUFFLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxJQUFJO2lCQUNwQjtnQkFDRCxNQUFNLEVBQUUsS0FBSztvQkFDVCxDQUFDLENBQUMsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FB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