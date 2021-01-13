export interface SpotifyArtist {
    name: string;
}
export interface SpotifyAlbum {
    artists: SpotifyArtist[];
    name: string;
    tracks: {
        items: SpotifyTrack[];
        next: string | null;
        previous: string | null;
    };
}
export interface SpotifyPlaylist {
    name: string;
    tracks: {
        items: Array<{
            track: SpotifyTrack;
        }>;
        next: string | null;
        previous: string | null;
    };
}
export interface SpotifyTrack {
    artists: SpotifyArtist[];
    id: string;
    name: string;
}
