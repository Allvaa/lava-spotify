import LavasfyClient from "../Client";
import { LavalinkTrackResponse, NodeOptions } from "../typings";
import Resolver from "./Resolver";
export default class Node {
    client: LavasfyClient;
    options: NodeOptions;
    resolver: Resolver;
    private readonly methods;
    constructor(client: LavasfyClient, options: NodeOptions);
    load(url: string): Promise<LavalinkTrackResponse>;
}
