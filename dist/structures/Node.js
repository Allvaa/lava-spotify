"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Resolver_1 = __importDefault(require("./Resolver"));
class Node {
    constructor(client, options) {
        this.client = client;
        this.resolver = new Resolver_1.default(this);
        this.methods = {
            album: this.resolver.getAlbum.bind(this.resolver),
            playlist: this.resolver.getPlaylist.bind(this.resolver),
            track: this.resolver.getTrack.bind(this.resolver)
        };
        Object.defineProperties(this, {
            id: { value: options.id },
            host: { value: options.host },
            port: { value: options.port },
            password: { value: options.password }
        });
    }
    load(url) {
        var _a;
        const [, type, id] = (_a = this.client.spotifyPattern.exec(url)) !== null && _a !== void 0 ? _a : [];
        return this.methods[type](id);
    }
}
exports.default = Node;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJ1Y3R1cmVzL05vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFQSwwREFBa0M7QUFFbEMsTUFBcUIsSUFBSTtJQWNyQixZQUEwQixNQUFxQixFQUFFLE9BQW9CO1FBQTNDLFdBQU0sR0FBTixNQUFNLENBQWU7UUFieEMsYUFBUSxHQUFHLElBQUksa0JBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQU9wQixZQUFPLEdBQUc7WUFDdkIsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQ2pELFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUN2RCxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7U0FDcEQsQ0FBQztRQUdFLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUU7WUFDMUIsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxFQUFFLEVBQUU7WUFDekIsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUU7WUFDN0IsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUU7WUFDN0IsUUFBUSxFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUU7U0FDeEMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLElBQUksQ0FBQyxHQUFXOztRQUNuQixNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLFNBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxtQ0FBSSxFQUFFLENBQUM7UUFDaEUsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQTZCLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMzRCxDQUFDO0NBQ0o7QUEzQkQsdUJBMkJDIn0=