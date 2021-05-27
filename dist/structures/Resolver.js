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
        const spotifyAlbum = await Util_1.default.tryPromise(async () => {
            return (await node_superfetch_1.default
                .get(`${this.client.baseURL}/albums/${id}`)
                .set("Authorization", this.token)).body;
        });
        const unresolvedAlbumTracks = (_a = spotifyAlbum === null || spotifyAlbum === void 0 ? void 0 : spotifyAlbum.tracks.items.map(track => this.buildUnresolved(track))) !== null && _a !== void 0 ? _a : [];
        return {
            loadType: spotifyAlbum ? "PLAYLIST_LOADED" : "NO_MATCHES",
            playlistInfo: {
                name: spotifyAlbum === null || spotifyAlbum === void 0 ? void 0 : spotifyAlbum.name
            },
            tracks: this.autoResolve ? (await Promise.all(unresolvedAlbumTracks.map(x => x.resolve()))).filter(Boolean) : unresolvedAlbumTracks
        };
    }
    async getPlaylist(id) {
        const spotifyPlaylist = await Util_1.default.tryPromise(async () => {
            return (await node_superfetch_1.default
                .get(`${this.client.baseURL}/playlists/${id}`)
                .set("Authorization", this.token)).body;
        });
        const unresolvedPlaylistTracks = spotifyPlaylist ? (await this.getPlaylistTracks(spotifyPlaylist)).map(x => this.buildUnresolved(x.track)) : [];
        return {
            loadType: spotifyPlaylist ? "PLAYLIST_LOADED" : "NO_MATCHES",
            playlistInfo: {
                name: spotifyPlaylist === null || spotifyPlaylist === void 0 ? void 0 : spotifyPlaylist.name
            },
            tracks: this.autoResolve ? (await Promise.all(unresolvedPlaylistTracks.map(x => x.resolve()))).filter(Boolean) : unresolvedPlaylistTracks
        };
    }
    async getTrack(id) {
        const spotifyTrack = await Util_1.default.tryPromise(async () => {
            return (await node_superfetch_1.default
                .get(`${this.client.baseURL}/tracks/${id}`)
                .set("Authorization", this.token)).body;
        });
        const unresolvedTrack = spotifyTrack && this.buildUnresolved(spotifyTrack);
        return {
            loadType: spotifyTrack ? "TRACK_LOADED" : "NO_MATCHES",
            playlistInfo: {},
            tracks: spotifyTrack ? this.autoResolve ? [await unresolvedTrack.resolve()] : [unresolvedTrack] : []
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
    async resolve(unresolvedTrack) {
        const cached = this.cache.get(unresolvedTrack.info.identifier);
        if (cached)
            return Util_1.default.structuredClone(cached);
        try {
            const lavaTrack = await this.retrieveTrack(unresolvedTrack);
            if (lavaTrack) {
                if (this.client.options.useSpotifyMetadata) {
                    Object.assign(lavaTrack.info, {
                        title: unresolvedTrack.info.title,
                        author: unresolvedTrack.info.author,
                        uri: unresolvedTrack.info.uri
                    });
                }
                this.cache.set(unresolvedTrack.info.identifier, Object.freeze(lavaTrack));
            }
            return Util_1.default.structuredClone(lavaTrack);
        }
        catch {
            return undefined;
        }
    }
    async retrieveTrack(unresolvedTrack) {
        try {
            const params = new URLSearchParams({
                identifier: `ytsearch:${unresolvedTrack.info.author} - ${unresolvedTrack.info.title} ${this.client.options.audioOnlyResults ? "Audio" : ""}`
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
    buildUnresolved(spotifyTrack) {
        const _this = this; // eslint-disable-line
        return {
            info: {
                identifier: spotifyTrack.id,
                title: spotifyTrack.name,
                author: spotifyTrack.artists.join(", "),
                uri: spotifyTrack.external_urls.spotify,
                length: spotifyTrack.duration_ms
            },
            resolve() {
                return _this.resolve(this);
            }
        };
    }
}
exports.default = Resolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlcy9SZXNvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLHNFQUFzQztBQUV0QyxtREFBMkI7QUFFM0IsTUFBcUIsUUFBUTtJQUl6QixZQUEwQixJQUFVO1FBQVYsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUg3QixXQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDMUIsVUFBSyxHQUFHLElBQUksR0FBRyxFQUF5QixDQUFDO0lBRVQsQ0FBQztJQUV4QyxJQUFXLEtBQUs7UUFDWixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBTSxDQUFDO0lBQzlCLENBQUM7SUFFRCxJQUFXLGlCQUFpQjtRQUN4QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGlCQUFpQixLQUFLLENBQUM7WUFDOUMsQ0FBQyxDQUFDLFFBQVE7WUFDVixDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsaUJBQWtCLENBQUM7SUFDakQsQ0FBQztJQUVELElBQVcsV0FBVztRQUNsQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVksQ0FBQztJQUM1QyxDQUFDO0lBRU0sS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFVOztRQUM1QixNQUFNLFlBQVksR0FBRyxNQUFNLGNBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDbEQsT0FBTyxDQUFDLE1BQU0seUJBQU87aUJBQ2hCLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxXQUFXLEVBQUUsRUFBRSxDQUFDO2lCQUMxQyxHQUFHLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQW9CLENBQUM7UUFDaEUsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLHFCQUFx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