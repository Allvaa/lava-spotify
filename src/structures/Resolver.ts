import Node from "./Node";

export default class Resolver {
    public client = this.node.client;

    public constructor(public node: Node) {}

    public get token(): string {
        return this.client.token!;
    }
}
