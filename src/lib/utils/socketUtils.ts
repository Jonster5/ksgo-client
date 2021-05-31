import type { RemoteShipObject } from '@classes/ship';
import type Peer from 'peerjs';
import type firebase from 'firebase/app';
import 'firebase/firestore';
import type { MapItem } from '../data/types';

export interface SocketProperties {
	ID: string;
	connection: Peer;

	ref: firebase.firestore.DocumentReference;

	init(ID: string, m: MapItem, info: { mp: number; private: boolean }): void;
}

export interface ServerProperties {}

export interface ClientProperties {}

export class ServerUtils {
	connection: Peer;

	constructor() {}

	destroy() {
		if (this.connection) this.connection.destroy();
	}
}
