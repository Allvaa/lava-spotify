import Client from "../Client";
import { LavalinkTrackResponse, NodeOptions } from "../typings";
import Resolver from "./Resolver";
export default class Node {
    client: Client;
    options: NodeOptions;
    resolver: Resolver;
    private readonly methods;
    constructor(client: Client, options: NodeOptions);
    load(url: string): Promise<LavalinkTrackResponse>;
}
