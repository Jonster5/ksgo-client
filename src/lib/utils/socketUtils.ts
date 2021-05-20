import type { RemoteShipObject } from '@classes/ship';
import type Peer from 'peerjs';
import type firebase from 'firebase/app';
import 'firebase/firestore';
import type { FireStore } from '../data/multiplayer';
import type { MapItem } from '../data/types';

export interface SocketProperties {
	ID: string;
	connection: Peer;

	fs: firebase.firestore.Firestore;

	init(ID: string, m: MapItem): void;
}

export interface ServerProperties {}

export interface ClientProperties {}

export class ServerUtils {
	connection: Peer;
	fs: FireStore;

	constructor(fs: FireStore) {
		this.fs = fs;
	}

	destroy() {
		if (this.connection) this.connection.destroy();
	}
}
