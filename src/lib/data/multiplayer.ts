export type KSGO_ID_TYPE = 'HOST' | 'CLIENT';

export const GET_KSGO_ID = (type: KSGO_ID_TYPE, n?: number) =>
    `KSGO|${type}|${n ?? window.crypto.getRandomValues(new Uint32Array(1))[0]}`;

export interface RemoteSendInfo {
    id: string;
    x: number;
    y: number;
    r: number;
    forward: boolean;
    right: boolean;
    left: boolean;
    reverse: boolean;
}

export interface HostSendInfo {
    map: { id: string; x: number; y: number }[];
    ships: RemoteSendInfo[];
}

export interface HostJoinInfo {
    map: {
        stars: { id: string; x: number; y: number; mass: number; color: string }[];
        planets: { id: string; x: number; y: number; mass: number; color: string }[];
        asteroids: { id: string; x: number; y: number; mass: number; color: string }[];
        spawns: { x: number; y: number; size: number }[];
    };
    players: {
        type: string;
        id: string;
        x: number;
        y: number;
        r: number;
        forward: boolean;
        right: boolean;
        left: boolean;
        reverse: boolean;
    }[];
}
