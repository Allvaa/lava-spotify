import { ClientOptions } from "./typings";
import request from "node-superfetch";

export default class Client {
    public readonly baseURL = "https://api.spotify.com/v1";
    public token: string | null = null;
    private nextRequest?: NodeJS.Timeout;

    public constructor(public options: ClientOptions) {}

    public async requestToken(): Promise<void> {
        if (this.nextRequest) return;

        try {
            const { body: { access_token, token_type, expires_in } }: any = await request
                .post("https://accounts.spotify.com/api/token")
                .set({
                    Authorization: `Basic ${Buffer.from(`${this.options.clientID}:${this.options.clientSecret}`).toString("base64")}`,
                    "Content-Type": "application/x-www-form-urlencoded"
                })
                .send("grant_type=client_credentials");

            this.token = `${token_type} ${access_token}`;
            this.nextRequest = setTimeout(() => {
                delete this.nextRequest;
                void this.requestToken();
            }, expires_in * 1000);
        } catch (e) {
            if (e.status == 400) {
                return Promise.reject(new Error("Invalid Spotify client."));
            }
            await this.requestToken();
        }
    }
}
