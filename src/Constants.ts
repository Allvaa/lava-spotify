import { ClientOptions, NodeOptions } from "./typings";

export const DefaultClientOptions: ClientOptions = {
    clientID: "",
    clientSecret: "",
    playlistLoadLimit: 2,
    audioOnlyResults: false,
    useSpotifyMetadata: false
};

export const DefaultNodeOptions: NodeOptions = {
    id: "",
    host: "",
    port: "",
    password: "",
    secure: false
};
