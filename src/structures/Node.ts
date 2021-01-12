import Client from "../Client";
import { NodeOptions } from "../typings";
import Resolver from "./Resolver";

export default class Node {
    public resolver = new Resolver(this);

    public constructor(public client: Client, public options: NodeOptions) {}
}
