import type { RemoteShipObject } from '@lib/ship';
import type Peer from 'simple-peer';

export interface ServerObject {
    clients: RemoteShipObject[];
    host: Peer;

    ID: string;
}

export class ServerUtils {}
