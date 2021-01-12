import Node from "./Node";
export default class Resolver {
    node: Node;
    client: import("..").Client;
    constructor(node: Node);
    get token(): string;
}
