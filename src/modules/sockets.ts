import { client, msaddress, serverdata, serverListID, ServerListItem, sockets } from './data';

function mwsopen(): void {
    console.info('MWS: Connected');
    this.MWS.send(
        JSON.stringify({
            id: 'user-connect',
            content: '',
        })
    );
}

function mwsmessage({ data }): void {
    const message = JSON.parse(data);

    if (message.id === 'user-connect-confirm') {
        client.id = message.content;
    } else if (message.id === 'user-serverlist') {
        if (message.content.length > serverdata.size) {
            for (let { id, name, address } of message.content) {
                if (serverdata.has(id)) continue;
                serverdata.set(id, {
                    name,
                    address,
                });
                break;
            }
        } else if (message.content.length < serverdata.size) {
            for (let id of serverdata.keys()) {
                if (message.content.some((x) => x.id === id)) continue;
                serverdata.delete(id);
                break;
            }
        }
    }
}

function mwserror(error) {
    setTimeout(MWSConnect.bind(this), 1000);
}

export function MWSConnect() {
    console.info('MWS: Connecting');
    this.MWS = new WebSocket(msaddress);
    this.MWS.onopen = mwsopen.bind(this);
    this.MWS.onmessage = mwsmessage.bind(this);
    this.MWS.onerror = mwserror.bind(this);
    // this.MWS.close = mwsclose.bind(this);
}

function SWSopen() {
    console.info('SWS: Connected');
    this.SWS.send(
        JSON.stringify({
            id: 'user-connect',
            content: {
                clientid: client.id,
            },
        })
    );
}

function SWSmessage({ data }) {
    const message = JSON.parse(data);

    if (message.id === 'create-lobby-confirm') {
        console.log(message.content.key);
    } else if (message.id === 'create-lobby-reject') {
        console.log(message.content.reason);
    }
}

function SWSConnect(id: string) {
    if (this.SWS) this.SWS.close();
    if (id) {
        this.SWS = new WebSocket(serverdata.get(id).address);
        this.SWS.onopen = SWSopen.bind(this);
        this.SWS.onmessage = SWSmessage.bind(this);
        this.SWSonerror = SWSerror.bind(this);
    } else console.warn('SWS: No endpoint available');
}

function SWSerror() {
    setTimeout(SWSConnect.bind(this), 1000);
}

export const init = () => {
    MWSConnect.call(sockets);
};

export { msaddress } from './data';
