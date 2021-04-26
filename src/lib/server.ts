import type { RemoteShipObject } from './ship';
import { ServerObject, ServerUtils } from './utils/serverUtils';
import type Peer from 'simple-peer';

export class Server extends ServerUtils implements ServerObject {
	clients: RemoteShipObject[];
	host: Peer;

	readonly ID: string;

	constructor(ID: string) {
		super();

		this.ID = ID;

		// this.host = new Peer();

		console.log(this.host);
	}
}
