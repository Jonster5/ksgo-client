import {
	ClientProperties,
	ServerProperties,
	ServerUtils,
	SocketProperties,
} from '@utils/socketUtils';
import Peer from 'peerjs';
import type { FireStore } from '../data/multiplayer';
import type { MapItem } from '../data/types';

export class Server
	extends ServerUtils
	implements SocketProperties, ServerProperties
{
	readonly ID: string;
	connection: Peer;

	fs: FireStore;

	constructor(fs: FireStore) {
		super(fs);
	}

	init(ID: string, m: MapItem) {
		this.destroy();

		this.connection = new Peer(ID);

		this.connection.on('open', (id) => {
			this.fs
				.collection('test')
				.doc(this.ID)
				.set({
					id,
					name: prompt("Enter this game's name"),
					map: m.name,
				});
		});

		this.connection.on('error', (err) => {
			throw new Error(err);
		});
	}

	remove() {
		this.fs.collection('test').doc(this.ID).delete();
	}
}

export class Client
	extends ServerUtils
	implements SocketProperties, ClientProperties
{
	readonly ID: string;
	connection: Peer;

	fs: FireStore;

	constructor(fs: FireStore) {
		super(fs);
	}

	init(ID: string) {
		this.destroy();

		this.connection = new Peer(ID);

		this.connection.on('open', (id) => {
			console.log(id);

			this.fs.collection('test').doc().set({
				id,
			});
		});

		this.connection.on('error', (err) => {
			throw new Error(err);
		});
	}
}
