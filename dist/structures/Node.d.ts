import Client from "../Client";
import { NodeOptions } from "../typings";
import Resolver from "./Resolver";
export default class Node {
    client: Client;
    options: NodeOptions;
    resolver: Resolver;
    constructor(client: Client, options: NodeOptions);
}
