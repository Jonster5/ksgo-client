import {
	ClientProperties,
	ServerProperties,
	ServerUtils,
	SocketProperties,
} from '@utils/socketUtils';
import Peer from 'peerjs';
import { Database, DBGameInfo, DocRef, GET_KSGO_ID } from '../data/multiplayer';
import type { MapItem } from '../data/types';

export class Server
	extends ServerUtils
	implements SocketProperties, ServerProperties
{
	ID: string;
	connection: Peer;

	ref: DocRef;

	constructor(ref: DocRef) {
		super();

		this.ref = ref;
	}

	async init(ID: string, m: MapItem, info: { mp: number; private: boolean }) {
		this.destroy();

		this.ID = GET_KSGO_ID('HOST', ID);

		await this.ref.set({
			KSGO_ID: this.ID,
			name: m.name,
			maxPlayers: info.mp,
			private: info.private,
			timeOfCreation: Date.now(),
		} as DBGameInfo);

		this.connection = new Peer(ID);

		this.connection.on('open', (id) => {
			console.log(id);
		});

		this.connection.on('connection', (conn) => {
			conn.on('open', () => {
				console.log('LLL');
			});
		});

		this.connection.on('error', (err) => {
			throw new Error(err);
		});
	}

	remove() {
		this.ref.delete();
	}
}

export class Client
	extends ServerUtils
	implements SocketProperties, ClientProperties
{
	ID: string;
	connection: Peer;

	ref: DocRef;

	constructor(ref: DocRef) {
		super();

		this.ref = ref;
	}

	async init(ID: string, m: MapItem, info: { mp: number; private: boolean }) {
		this.destroy();

		this.ID = GET_KSGO_ID('HOST', ID);

		await this.ref.set({
			KSGO_ID: this.ID,
			name: m.name,
			maxPlayers: info.mp,
			private: info.private,
			timeOfCreation: Date.now(),
		} as DBGameInfo);

		this.connection = new Peer(ID);

		this.connection.on('open', (id) => {});

		this.connection.on('error', (err) => {
			throw new Error(err);
		});
	}

	remove() {
		this.ref.delete();
	}
}
