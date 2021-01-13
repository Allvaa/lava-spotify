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
    get playlistPageLoadLimit() {
        var _a;
        return this.client.options.playlistPageLoadLimit === 0
            ? Infinity
            : (_a = this.client.options.playlistPageLoadLimit) !== null && _a !== void 0 ? _a : 2;
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
    getPlaylistTracks(playlist, currPage = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!playlist.tracks.next)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlcy9SZXNvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUNBLHNFQUFzQztBQUd0QyxNQUFxQixRQUFRO0lBR3pCLFlBQTBCLElBQVU7UUFBVixTQUFJLEdBQUosSUFBSSxDQUFNO1FBRjdCLFdBQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUVNLENBQUM7SUFFeEMsSUFBVyxLQUFLO1FBQ1osT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQU0sQ0FBQztJQUM5QixDQUFDO0lBRUQsSUFBVyxxQkFBcUI7O1FBQzVCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMscUJBQXFCLEtBQUssQ0FBQztZQUNsRCxDQUFDLENBQUMsUUFBUTtZQUNWLENBQUMsT0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsbUNBQUksQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFWSxRQUFRLENBQUMsRUFBVTs7WUFDNUIsSUFBSSxLQUErQixDQUFDO1lBQ3BDLElBQUk7Z0JBQ0EsS0FBSyxHQUFHLENBQUMsTUFBTSx5QkFBTztxQkFDakIsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLFdBQVcsRUFBRSxFQUFFLENBQUM7cUJBQzFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBb0IsQ0FBQzthQUMvRDtZQUFDLFFBQVEsSUFBSSxJQUFOLEVBQUUsSUFBSSxFQUFFO1lBRWhCLE9BQU87Z0JBQ0gsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLFlBQVk7Z0JBQ2xELFlBQVksRUFBRTtvQkFDVixJQUFJLEVBQUUsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxD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