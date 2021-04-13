export interface ClientOptions {
    /** Spotify client ID */
    clientID: string;
    /** Spotify client Secret */
    clientSecret: string;
    /** Maximum pages of playlist to load */
    playlistPageLimit?: number;
    /** This will filter the results to auto generated videos */
    audioOnlyResults?: boolean;
    /** {@link LavalinkTrack#info#title}, {@link LavalinkTrack#info#author}, {@link LavalinkTrack#info#uri} will be set to spotify's */
    useSpotifyMetadata?: boolean;
}
export * from "./Lavalink";
export * from "./Spotify";
