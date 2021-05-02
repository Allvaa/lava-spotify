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
    async getAlbum(id) {
        const album = await Util_1.default.tryPromise(async () => {
            return (await node_superfetch_1.default
                .get(`${this.client.baseURL}/albums/${id}`)
                .set("Authorization", this.token)).body;
        });
        return {
            loadType: album ? "PLAYLIST_LOADED" : "NO_MATCHES",
            playlistInfo: {
                name: album === null || album === void 0 ? void 0 : album.name
            },
            tracks: album
                ? (await Promise.all(album.tracks.items.map(x => this.resolve(x)))).filter(Boolean)
                : []
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
            tracks: (await Promise.all(playlistTracks.map(x => x.track && this.resolve(x.track)))).filter(Boolean)
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
            tracks: lavaTrack ? [lavaTrack] : []
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
                .get(`http://${this.node.host}:${this.node.port}/loadtracks?${params.toString()}`)
                .set("Authorization", this.node.password);
            return response.tracks[0];
        }
        catch {
            return undefined;
        }
    }
}
exports.default = Resolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlcy9SZXNvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLHNFQUFzQztBQUV0QyxtREFBMkI7QUFFM0IsTUFBcUIsUUFBUTtJQUl6QixZQUEwQixJQUFVO1FBQVYsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUg3QixXQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDMUIsVUFBSyxHQUFHLElBQUksR0FBRyxFQUF5QixDQUFDO0lBRVQsQ0FBQztJQUV4QyxJQUFXLEtBQUs7UUFDWixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBTSxDQUFDO0lBQzlCLENBQUM7SUFFRCxJQUFXLGlCQUFpQjtRQUN4QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGlCQUFpQixLQUFLLENBQUM7WUFDOUMsQ0FBQyxDQUFDLFFBQVE7WUFDVixDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsaUJBQWtCLENBQUM7SUFDakQsQ0FBQztJQUVNLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBVTtRQUM1QixNQUFNLEtBQUssR0FBRyxNQUFNLGNBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDM0MsT0FBTyxDQUFDLE1BQU0seUJBQU87aUJBQ2hCLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxXQUFXLEVBQUUsRUFBRSxDQUFDO2lCQUMxQyxHQUFHLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQW9CLENBQUM7UUFDaEUsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPO1lBQ0gsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLFlBQVk7WUFDbEQsWUFBWSxFQUFFO2dCQUNW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