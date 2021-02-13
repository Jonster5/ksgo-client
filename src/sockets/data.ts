export interface ServerListItem {
    id: string;
    name: string;
    address: string;
}

export interface ClientObject {
    id: string;
    name?: string;
}

export interface ClientSocketObject {
    MWS: WebSocket | null;
    SWS: WebSocket | null;
    game: {
        AWS: WebSocket | null;
        GWS: WebSocket | null;
    };
}

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

export const msaddress = 'ws://192.168.1.157:4000';
// export const msaddress = 'wss://ksgo-master.herokuapp.com';

export const gserverlist: Array<ServerListItem> = [
    {
        id: null,
        name: 'Server',
        address: 'ws://192.168.1.157:8000',
    },
    {
        id: null,
        name: 'USA',
        address: '',
    },
    {
        id: null,
        name: 'EU',
        address: '',
    },
];
