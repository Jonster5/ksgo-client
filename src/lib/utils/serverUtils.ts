import type { RemoteShipObject } from '@classes/ship';
import type Peer from 'peerjs';

export interface ServerObject {
	clients: RemoteShipObject[];
	host: Peer;

	ID: string;
}

export class ServerUtils {}
