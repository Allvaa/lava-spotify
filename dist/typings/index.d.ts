export interface ClientOptions {
    /** Spotify client ID */
    clientID: string;
    /** Spotify client Secret */
    clientSecret: string;
    /**
     * Maximum pages of playlist to load (each page contains 100 tracks)
     * @default 2
     */
    playlistLoadLimit?: number;
    /**
     * This will filter the search to video that only contains audio of the Spotify track (likely)
     * @default false
     */
    audioOnlyResults?: boolean;
    /**
     * The original value of title, author, and uri in {@link LavalinkTrack} will be replaced to Spotify's
     * @default false
     */
    useSpotifyMetadata?: boolean;
}
export * from "./Lavalink";
export * from "./Spotify";
