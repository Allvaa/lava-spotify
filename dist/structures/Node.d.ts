import LavasfyClient from "../Client";
import { LavalinkTrackResponse, NodeOptions } from "../typings";
import Resolver from "./Resolver";
export default class Node {
    client: LavasfyClient;
    resolver: Resolver;
    id: string;
    host: string;
    port: number | string;
    password: string;
    private readonly methods;
    constructor(client: LavasfyClient, options: NodeOptions);
    load(url: string): Promise<LavalinkTrackResponse>;
}
