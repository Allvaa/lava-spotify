import Client from "../Client";
import { NodeOptions } from "../typings";

export default class Node {
    public constructor(public client: Client, public options: NodeOptions) {}
}
