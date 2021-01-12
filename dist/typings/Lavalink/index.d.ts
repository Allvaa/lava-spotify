export interface NodeOptions {
    id: string;
    host: string;
    port: number | string;
    password: string;
}
export interface LavalinkTrack {
    track: string;
    info: {
        identifier: string;
        isSeekable: boolean;
        author: string;
        length: number;
        isStream: boolean;
        position: number;
        title: string;
        uri: string;
    };
}
export interface LavalinkTrackResponse {
    loadType: "TRACK_LOADED" | "PLAYLIST_LOADED" | "SEARCH_RESULT" | "NO_MATCHES" | "LOAD_FAILED";
    playlistInfo: {
        name?: string;
        selectedTrack?: number;
    };
    tracks: LavalinkTrack[];
    exception?: {
        message: string;
        severity: string;
    };
}
