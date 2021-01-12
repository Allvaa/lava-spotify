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
                tracks: album ? yield Promise.all(album.tracks.items.map((x) => this.resolve(x))) : []
            };
        });
    }
    resolve(track) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = new URLSearchParams({
                identifier: `ytsearch:${track.artists[0].name} - ${track.name}`
            }).toString();
            const { body } = yield node_superfetch_1.default
                .get(`http://${this.node.options.host}:${this.node.options.port}/loadtracks?${params}`)
                .set("Authorization", this.node.options.password);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return body.tracks ? body.tracks[0] : undefined;
        });
    }
}
exports.default = Resolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlcy9SZXNvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUNBLHNFQUFzQztBQUV0QyxNQUFxQixRQUFRO0lBR3pCLFlBQTBCLElBQVU7UUFBVixTQUFJLEdBQUosSUFBSSxDQUFNO1FBRjdCLFdBQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUVNLENBQUM7SUFFeEMsSUFBVyxLQUFLO1FBQ1osT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQU0sQ0FBQztJQUM5QixDQUFDO0lBRVksUUFBUSxDQUFDLEVBQVU7O1lBQzVCLElBQUksS0FBVSxDQUFDO1lBQ2YsSUFBSTtnQkFDQSxLQUFLLEdBQUcsQ0FBQyxNQUFNLHlCQUFPO3FCQUNqQixHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sV0FBVyxFQUFFLEVBQUUsQ0FBQztxQkFDMUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7YUFDL0M7WUFBQyxRQUFRLElBQUksSUFBTixFQUFFLElBQUksRUFBRTtZQUVoQixPQUFPO2dCQUNILFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxZQUFZO2dCQUNsRCxZQUFZLEVBQUU7b0JBQ1YsSUFBSSxFQUFFLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxJQUFJO2lCQUNwQjtnQkFDRCxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTthQUM5RixDQUFDO1FBQ04sQ0FBQztLQUFBO0lBRWEsT0FBTyxDQUFDLEtBQVU7O1lBQzVCLE1BQU0sTUFBTSxHQUFHLElBQUksZUFBZSxDQUFDO2dCQUMvQixVQUFVLEVBQUUsWUFBWSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxLQUFLLENBQUMsSUFBSSxFQUFFO2FBQ2xFLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUVkLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBUSxNQUFNLHlCQUFPO2lCQUM5QixHQUFHLENBQUMsVUFBVSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxlQUFlLE1BQU0sRUFBRSxDQUFDO2lCQUN0RixHQUFHLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRXRELCtEQUErRDtZQUMvRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUNwRCxDQUFDO0tBQUE7Q0FDSjtBQXRDRCwyQkFzQ0MifQ==