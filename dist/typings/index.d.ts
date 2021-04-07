export interface ClientOptions {
    clientID: string;
    clientSecret: string;
    playlistPageLimit?: number;
    audioOnlyResults?: boolean;
}
export * from "./Lavalink";
export * from "./Spotify";
