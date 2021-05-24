"use strict";
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
    get playlistLoadLimit() {
        return this.client.options.playlistLoadLimit === 0
            ? Infinity
            : this.client.options.playlistLoadLimit;
    }
    get autoResolve() {
        return this.client.options.autoResolve;
    }
    async getAlbum(id) {
        var _a;
        const album = await Util_1.default.tryPromise(async () => {
            return (await node_superfetch_1.default
                .get(`${this.client.baseURL}/albums/${id}`)
                .set("Authorization", this.token)).body;
        });
        const albumTracks = (_a = album === null || album === void 0 ? void 0 : album.tracks.items) !== null && _a !== void 0 ? _a : [];
        return {
            loadType: album ? "PLAYLIST_LOADED" : "NO_MATCHES",
            playlistInfo: {
                name: album === null || album === void 0 ? void 0 : album.name
            },
            tracks: this.autoResolve ? (await Promise.all(albumTracks.map(x => this.resolve(x)))).filter(Boolean) : albumTracks.map((track) => ({ info: { title: track.name, author: track.artists.join(", "), uri: track.external_urls.spotify } }))
        };
    }
    async getPlaylist(id) {
        const playlist = await Util_1.default.tryPromise(async () => {
            return (await node_superfetch_1.default
                .get(`${this.client.baseURL}/playlists/${id}`)
                .set("Authorization", this.token)).body;
        });
        const playlistTracks = playlist ? await this.getPlaylistTracks(playlist) : [];
        return {
            loadType: playlist ? "PLAYLIST_LOADED" : "NO_MATCHES",
            playlistInfo: {
                name: playlist === null || playlist === void 0 ? void 0 : playlist.name
            },
            tracks: this.autoResolve ? (await Promise.all(playlistTracks.map(x => x.track && this.resolve(x.track)))).filter(Boolean) : playlistTracks.map(({ track }) => ({ info: { title: track.name, author: track.artists.join(", "), uri: track.external_urls.spotify } }))
        };
    }
    async getTrack(id) {
        const track = await Util_1.default.tryPromise(async () => {
            return (await node_superfetch_1.default
                .get(`${this.client.baseURL}/tracks/${id}`)
                .set("Authorization", this.token)).body;
        });
        const lavaTrack = track && await this.resolve(track);
        return {
            loadType: lavaTrack ? "TRACK_LOADED" : "NO_MATCHES",
            playlistInfo: {},
            tracks: this.autoResolve ? lavaTrack ? [lavaTrack] : [] : [{ info: { title: track.name, author: track.artists.join(", "), uri: track === null || track === void 0 ? void 0 : track.external_urls.spotify } }]
        };
    }
    async getPlaylistTracks(playlist, currPage = 1) {
        if (!playlist.tracks.next || currPage >= this.playlistLoadLimit)
            return playlist.tracks.items;
        currPage++;
        const { body } = await node_superfetch_1.default
            .get(playlist.tracks.next)
            .set("Authorization", this.token);
        const { items, next } = body;
        const mergedPlaylistTracks = playlist.tracks.items.concat(items);
        if (next && currPage < this.playlistLoadLimit)
            return this.getPlaylistTracks({
                tracks: {
                    items: mergedPlaylistTracks,
                    next
                }
            }, currPage);
        else
            return mergedPlaylistTracks;
    }
    async resolve(track) {
        const cached = this.cache.get(track.id);
        if (cached)
            return Util_1.default.structuredClone(cached);
        try {
            const lavaTrack = await this.retrieveTrack(track);
            if (lavaTrack) {
                if (this.client.options.useSpotifyMetadata) {
                    Object.assign(lavaTrack.info, {
                        title: track.name,
                        author: track.artists.map(x => x.name).join(", "),
                        uri: track.external_urls.spotify
                    });
                }
                this.cache.set(track.id, Object.freeze(lavaTrack));
            }
            return Util_1.default.structuredClone(lavaTrack);
        }
        catch {
            return undefined;
        }
    }
    async retrieveTrack(track) {
        try {
            const params = new URLSearchParams({
                identifier: `ytsearch:${track.artists.map(x => x.name).join(", ")} - ${track.name} ${this.client.options.audioOnlyResults ? "Audio" : ""}`
            });
            // @ts-expect-error 2322
            const { body: response } = await node_superfetch_1.default
                .get(`http${this.node.secure ? "s" : ""}://${this.node.host}:${this.node.port}/loadtracks?${params.toString()}`)
                .set("Authorization", this.node.password);
            return response.tracks[0];
        }
        catch {
            return undefined;
        }
    }
}
exports.default = Resolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlcy9SZXNvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLHNFQUFzQztBQUV0QyxtREFBMkI7QUFFM0IsTUFBcUIsUUFBUTtJQUl6QixZQUEwQixJQUFVO1FBQVYsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUg3QixXQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDMUIsVUFBSyxHQUFHLElBQUksR0FBRyxFQUF5QixDQUFDO0lBRVQsQ0FBQztJQUV4QyxJQUFXLEtBQUs7UUFDWixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBTSxDQUFDO0lBQzlCLENBQUM7SUFFRCxJQUFXLGlCQUFpQjtRQUN4QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGlCQUFpQixLQUFLLENBQUM7WUFDOUMsQ0FBQyxDQUFDLFFBQVE7WUFDVixDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsaUJBQWtCLENBQUM7SUFDakQsQ0FBQztJQUVELElBQVcsV0FBVztRQUNsQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVksQ0FBQztJQUM1QyxDQUFDO0lBRU0sS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFVOztRQUM1QixNQUFNLEtBQUssR0FBRyxNQUFNLGNBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDM0MsT0FBTyxDQUFDLE1BQU0seUJBQU87aUJBQ2hCLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxXQUFXLEVBQUUsRUFBRSxDQUFDO2lCQUMxQyxHQUFHLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQW9CLENBQUM7UUFDaEUsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLFdBQVcs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