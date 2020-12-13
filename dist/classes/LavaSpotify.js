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
const spotifyPattern = /^(?:https:\/\/open\.spotify\.com\/(?:user\/[A-Za-z0-9]+\/)?|spotify:)(album|playlist|track)(?:[/:])([A-Za-z0-9]+).*$/;
class LavaSpotify {
    constructor(node, options) {
        this.node = node;
        this.options = options;
        this.baseURL = "https://api.spotify.com/v1";
        this.token = null;
    }
    isValidURL(url) {
        return spotifyPattern.test(url);
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
                loadType: album.error ? "NO_MATCHES" : "PLAYLIST_LOADED",
                playlistInfo: {
                    name: album.name
                },
                tracks: album.error ? [] : yield Promise.all(album.tracks.items.map(x => this.resolve(x)))
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
            const playlistTracks = asLavaTrack ? yield this.getPlaylistTracks(playlist) : playlist.tracks.items;
            return asLavaTrack ? {
                loadType: playlist.error ? "NO_MATCHES" : "PLAYLIST_LOADED",
                playlistInfo: {
                    name: playlist.name
                },
                tracks: playlist.error ? [] : (yield Promise.all(playlistTracks.map(x => this.resolve(x.track)))).filter(Boolean)
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
                loadType: track.error ? "NO_MATCHES" : "TRACK_LOADED",
                playlistInfo: {},
                tracks: track.error ? [] : [yield this.resolve(track)]
            } : track;
        });
    }
    getPlaylistTracks(playlist) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!playlist.tracks.next)
                return playlist.tracks.items;
            const { items, next } = yield (yield node_fetch_1.default(playlist.tracks.next, {
                headers: {
                    Authorization: this.token
                }
            })).json();
            const mergedPlaylistTracks = playlist.tracks.items.concat(items);
            if (next)
                return this.getPlaylistTracks({
                    tracks: {
                        items: mergedPlaylistTracks,
                        next
                    }
                });
            else
                return mergedPlaylistTracks;
        });
    }
    resolve(track) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = new URLSearchParams({
                identifier: `ytsearch:${track.artists[0].name} - ${track.name}`
            }).toString();
            const result = (yield (yield node_fetch_1.default(`http://${this.node.host}:${this.node.port}/loadtracks?${params}`, {
                headers: {
                    Authorization: this.node.password
                }
            })).json());
            return result.tracks ? result.tracks[0] : undefined;
        });
    }
    requestToken() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.nextRequest)
                return;
            const auth = Buffer.from(`${this.options.clientID}:${this.options.clientSecret}`).toString("base64");
            try {
                const { access_token, token_type, expires_in, error } = yield (yield node_fetch_1.default("https://accounts.spotify.com/api/token", {
                    method: "POST",
                    body: "grant_type=client_credentials",
                    headers: {
                        Authorization: `Basic ${auth}`,
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                })).json();
                if (error === "invalid_client")
                    return Promise.reject(new Error("Invalid Spotify client."));
                this.token = `${token_type} ${access_token}`;
                this.nextRequest = setTimeout(() => {
                    delete this.nextRequest;
                    void this.requestToken();
                }, expires_in * 1000);
            }
            catch (_a) {
                yield this.requestToken();
            }
        });
    }
}
exports.default = LavaSpotify;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGF2YVNwb3RpZnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2xhc3Nlcy9MYXZhU3BvdGlmeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUNBLDREQUErQjtBQUUvQixNQUFNLGNBQWMsR0FBRyxzSEFBc0gsQ0FBQztBQUU5SSxNQUFxQixXQUFXO0lBSzVCLFlBQTBCLElBQWtCLEVBQVMsT0FBdUI7UUFBbEQsU0FBSSxHQUFKLElBQUksQ0FBYztRQUFTLFlBQU8sR0FBUCxPQUFPLENBQWdCO1FBSjNELFlBQU8sR0FBRyw0QkFBNEIsQ0FBQztRQUNoRCxVQUFLLEdBQWtCLElBQUksQ0FBQztJQUcyQyxDQUFDO0lBRXpFLFVBQVUsQ0FBQyxHQUFXO1FBQ3pCLE9BQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRU0sSUFBSSxDQUFDLEdBQVc7O1FBQ25CLE1BQU0sU0FBUyxHQUFHO1lBQ2QsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUMvQixRQUFRLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3JDLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDbEMsQ0FBQztRQUNGLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsU0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxtQ0FBSSxFQUFFLENBQUM7UUFDcEQsT0FBTyxTQUFTLENBQUMsSUFBOEIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQW1DLENBQUM7SUFDakcsQ0FBQztJQUtZLFFBQVEsQ0FBQyxFQUFVLEVBQUUsV0FBVyxHQUFHLEtBQUs7O1lBQ2pELE1BQU0sS0FBSyxHQUFpQixNQUFNLENBQUMsTUFBTSxvQkFBSyxDQUFDLEdB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