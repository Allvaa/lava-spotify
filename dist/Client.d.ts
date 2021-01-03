import { ClientOptions } from "./typings";
export default class Client {
    options: ClientOptions;
    readonly baseURL = "https://api.spotify.com/v1";
    token: string | null;
    private nextRequest?;
    constructor(options: ClientOptions);
    requestToken(): Promise<void>;
}
