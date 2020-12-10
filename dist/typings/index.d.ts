export interface LavalinkNode {
    host: string;
    port: number;
    password: string;
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
export interface SpotifyOptions {
    clientID: string;
    clientSecret: string;
}
export interface SpotifyArtist {
    id: string;
    name: string;
}
export interface SpotifyAlbum {
    artists: SpotifyArtist[];
    id: string;
    images: {
        height: number;
        url: string;
        width: number;
    };
    name: string;
    tracks: {
        items: SpotifyTrack[];
        next: string | null;
        previous: string | null;
    };
    error?: SpotifyError;
}
export interface SpotifyPlaylist {
    id: string;
    images: {
        height: number;
        url: string;
        width: number;
    };
    name: string;
    tracks: {
        items: SpotifyPlaylistTrack[];
        next: string | null;
        previous: string | null;
    };
    error?: SpotifyError;
}
export interface SpotifyTrack {
    artists: SpotifyArtist[];
    href: string;
    id: string;
    name: string;
    error?: SpotifyError;
}
export interface SpotifyPlaylistTrack {
    added_at: Date;
    added_by: {
        display_name: string;
        id: string;
    };
    track: SpotifyTrack;
}
export interface SpotifyError {
    status: number;
    message: string;
}
