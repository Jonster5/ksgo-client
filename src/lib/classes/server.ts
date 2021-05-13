import { ServerUtils, ServerObject } from '@utils/serverUtils';
import Peer from 'peerjs';
import type { RemoteShipObject } from './ship';

export class Server extends ServerUtils implements ServerObject {
	clients: RemoteShipObject[];
	host: Peer;

	readonly ID: string;

	constructor(ID: string) {
		super();

		this.ID = ID;

		this.host = new Peer(ID);

		console.log(this.host);
	}
}
