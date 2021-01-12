"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Resolver_1 = __importDefault(require("./Resolver"));
class Node {
    constructor(client, options) {
        this.client = client;
        this.options = options;
        this.resolver = new Resolver_1.default(this);
    }
}
exports.default = Node;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJ1Y3R1cmVzL05vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFQSwwREFBa0M7QUFFbEMsTUFBcUIsSUFBSTtJQUdyQixZQUEwQixNQUFjLEVBQVMsT0FBb0I7UUFBM0MsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFTLFlBQU8sR0FBUCxPQUFPLENBQWE7UUFGOUQsYUFBUSxHQUFHLElBQUksa0JBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUVtQyxDQUFDO0NBQzVFO0FBSkQsdUJBSUMifQ==