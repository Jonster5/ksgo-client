import { writable } from 'svelte/store';

export interface ServerListItem {
    name: string;
    address: string;
}

export interface ClientObject {
    id: string;
}

export interface ClientSocketObject {
    MWS: WebSocket | null;
    SWS: WebSocket | null;
    game: {
        AWS: WebSocket | null;
        GWS: WebSocket | null;
    };
}

export const serverdata = new Map<string, ServerListItem>();

export const sockets: ClientSocketObject = {
    MWS: null,
    SWS: null,
    game: {
        AWS: null,
        GWS: null,
    },
};

export const client: ClientObject = {
    id: null,
};

export const serverListID = writable<string>('');

export const msaddress = 'ws://192.168.1.157:4000';
// export const msaddress = 'wss://ksgo-master.herokuapp.com';
