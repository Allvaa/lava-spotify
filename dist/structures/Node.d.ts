import Client from "../Client";
import { NodeOptions } from "../typings";
export default class Node {
    client: Client;
    options: NodeOptions;
    constructor(client: Client, options: NodeOptions);
}
