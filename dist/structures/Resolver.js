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
    get playlistPageLimit() {
        return this.client.options.playlistPageLimit === 0
            ? Infinity
            : this.client.options.playlistPageLimit;
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
            tracks: (await Promise.all(playlistTracks.map(x => this.resolve(x.track)))).filter(Boolean)
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
        if (!playlist.tracks.next || currPage >= this.playlistPageLimit)
            return playlist.tracks.items;
        currPage++;
        const { body } = await node_superfetch_1.default
            .get(playlist.tracks.next)
            .set("Authorization", this.token);
        const { items, next } = body;
        const mergedPlaylistTracks = playlist.tracks.items.concat(items);
        if (next && currPage < this.playlistPageLimit)
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
            const params = new URLSearchParams({
                identifier: `ytsearch:${track.artists[0].name} - ${track.name} ${this.client.options.audioOnlyResults ? `length=${track.duration_ms}` : ""}`
            }).toString();
            // @ts-expect-error 2322
            const { body } = await node_superfetch_1.default
                .get(`http://${this.node.host}:${this.node.port}/loadtracks?${params}`)
                .set("Authorization", this.node.password);
            if (body.tracks.length) {
                const lavaTrack = body.tracks[0];
                if (this.client.options.useSpotifyMetadata) {
                    Object.assign(lavaTrack.info, {
                        title: track.name,
                        author: track.artists.map(artist => artist.name).join(", "),
                        uri: track.external_urls.spotify
                    });
                }
                this.cache.set(track.id, Object.freeze(lavaTrack));
            }
            return Util_1.default.structuredClone(body.tracks[0]);
        }
        catch {
            return undefined;
        }
    }
}
exports.default = Resolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlcy9SZXNvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLHNFQUFzQztBQUV0QyxtREFBMkI7QUFFM0IsTUFBcUIsUUFBUTtJQUl6QixZQUEwQixJQUFVO1FBQVYsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUg3QixXQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDMUIsVUFBSyxHQUFHLElBQUksR0FBRyxFQUF5QixDQUFDO0lBRVQsQ0FBQztJQUV4QyxJQUFXLEtBQUs7UUFDWixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBTSxDQUFDO0lBQzlCLENBQUM7SUFFRCxJQUFXLGlCQUFpQjtRQUN4QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGlCQUFpQixLQUFLLENBQUM7WUFDOUMsQ0FBQyxDQUFDLFFBQVE7WUFDVixDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsaUJBQWtCLENBQUM7SUFDakQsQ0FBQztJQUVNLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBVTtRQUM1QixNQUFNLEtBQUssR0FBRyxNQUFNLGNBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDM0MsT0FBTyxDQUFDLE1BQU0seUJBQU87aUJBQ2hCLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxXQUFXLEVBQUUsRUFBRSxDQUFDO2lCQUMxQyxHQUFHLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQW9CLENBQUM7UUFDaEUsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPO1lBQ0gsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLFlBQVk7WUFDbEQsWUFBWSxFQUFFO2dCQUNWLElBQUksRUFBRSxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsSUFBSTthQUNwQjtZQUNELE1BQU0sRUFBRSxLQUFLO2dCQUNULENBQUMsQ0FBQyxDQUFDLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQW9CO2dCQUN0RyxDQUFDLENBQUMsRUFBRTtTQUNYLENBQUM7SUFDTixDQUFDO0lBRU0sS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFVO1FBQy9CLE1BQU0sUUFBUSxHQUFHLE1BQU0sY0FBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUM5QyxPQUFPLENBQUMsTUFBTSx5QkFBTztpQkFDaEIsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLGNBQWMsRUFBRSxFQUFFLENBQUM7aUJBQzdDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBdUIsQ0FBQztRQUNuRSxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUU5RSxPQUFPO1lBQ0gsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLFlBQVk7WUFDckQsWUFBWSxFQUFFO2dCQUNWLElBQUksRUFBRSxRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUUsSUFBSTthQUN2QjtZQUNELE1BQU0sRUFBRSxDQUFDLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBb0I7U0FDakgsQ0FBQztJQUNOLENBQUM7SUFFTSxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQVU7UUFDNUIsTUFBTSxLQUFLLEdBQUcsTUFBTSxjQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssSUFBSSxFQUFFO1lBQzNDLE9BQU8sQ0FBQyxNQUFNLHlCQUFPO2lCQUNoQixHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sV0FBVyxFQUFFLEVBQUUsQ0FBQztpQkFDMUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFvQixDQUFDO1FBQ2hFLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxTQUFTLEdBQUcsS0FBSyxJQUFJLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVyRCxPQUFPO1lBQ0gsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxZQUFZO1lBQ25ELFlBQVksRUFBRSxFQUFFO1lBQ2hCLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7U0FDdkMsQ0FBQztJQUNOLENBQUM7SUFFTyxLQUFLLENBQUMsaUJBQWlCLENBQUMsUUFLL0IsRUFBRSxRQUFRLEdBQUcsQ0FBQztRQUNYLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxRQUFRLElBQUksSUFBSSxDQUFDLGlCQUFpQjtZQUFFLE9BQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDOUYsUUFBUSxFQUFFLENBQUM7UUFFWCxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQVEsTUFBTSx5QkFBTzthQUM5QixHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7YUFDekIsR0FBRyxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFdEMsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsR0FBbUUsSUFBSSxDQUFDO1FBRTdGLE1BQU0sb0JBQW9CLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRWpFLElBQUksSUFBSSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsaUJBQWlCO1lBQUUsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUM7Z0JBQ3pFLE1BQU0sRUFBRTtvQkFDSixLQUFLLEVBQUUsb0JBQW9CO29CQUMzQixJQUFJO2lCQUNQO2FBQ0osRUFBRSxRQUFRLENBQUMsQ0FBQzs7WUFDUixPQUFPLG9CQUFvQixDQUFDO0lBQ3JDLENBQUM7SUFFTyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQW1CO1FBQ3JDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN4QyxJQUFJLE1BQU07WUFBRSxPQUFPLGNBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFaEQsSUFBSTtZQUNBLE1BQU0sTUFBTSxHQUFHLElBQUksZUFBZSxDQUFDO2dCQUMvQixVQUFVLEVBQUUsWUFBWSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxLQUFLLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxVQUFVLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO2FBQy9JLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUVkLHdCQUF3QjtZQUN4QixNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQW9DLE1BQU0seUJBQU87aUJBQzFELEdBQUcsQ0FBQyxVQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxlQUFlLE1BQU0sRUFBRSxDQUFDO2lCQUN0RSxHQUFHLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFOUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTtnQkFDcEIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRTtvQkFDeEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFO3dCQUMxQixLQUFLLEVBQUUsS0FBSyxDQUFDLElBQUk7d0JBQ2pCLE1BQU0sRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO3dCQUMzRCxHQUFHLEVBQUUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPO3FCQUNuQyxDQUFDLENBQUM7aUJBQ047Z0JBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7YUFDdEQ7WUFFRCxPQUFPLGNBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQy9DO1FBQUMsTUFBTTtZQUNKLE9BQU8sU0FBUyxDQUFDO1NBQ3BCO0lBQ0wsQ0FBQztDQUNKO0FBN0hELDJCQTZIQyJ9