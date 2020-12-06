import type { LavalinkNode, LavalinkTrackResponse, SpotifyAlbum, SpotifyOptions, SpotifyPlaylist, SpotifyTrack } from "../typings";
export default class LavaSpotify {
    node: LavalinkNode;
    options: SpotifyOptions;
    private readonly baseURL;
    private token;
    private nextRequest?;
    constructor(node: LavalinkNode, options: SpotifyOptions);
    isValidURL(url: string): boolean;
    load(url: string): Promise<LavalinkTrackResponse>;
    getAlbum(id: string): Promise<SpotifyAlbum>;
    getAlbum(id: string, asLavaTrack: false): Promise<SpotifyAlbum>;
    getAlbum(id: string, asLavaTrack: true): Promise<LavalinkTrackResponse>;
    getPlaylist(id: string): Promise<SpotifyPlaylist>;
    getPlaylist(id: string, asLavaTrack: false): Promise<SpotifyPlaylist>;
    getPlaylist(id: string, asLavaTrack: true): Promise<LavalinkTrackResponse>;
    getTrack(id: string): Promise<SpotifyTrack>;
    getTrack(id: string, asLavaTrack: false): Promise<SpotifyTrack>;
    getTrack(id: string, asLavaTrack: true): Promise<LavalinkTrackResponse>;
    private resolve;
    requestToken(): Promise<void>;
}
