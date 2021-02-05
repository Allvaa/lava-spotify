export interface ClientOptions {
    clientID: string;
    clientSecret: string;
    playlistPageLoadLimit?: number;
    filterAudioOnlyResult?: boolean;
    alwaysUseYTMusic?: boolean;
}
export * from "./Lavalink";
export * from "./Spotify";
