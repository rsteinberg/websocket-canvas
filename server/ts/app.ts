import WebSocket from 'ws';
import Coordinates from './coordinates';

const wss = new WebSocket.Server({ port: 8081 });
const receivers: WebSocket[] = [];
let sender: WebSocket | null = null;

const paths = [] as Coordinates[][];

let currentPath = [] as Coordinates[];

wss.on('connection', ws => {
    console.log('CONNECTION incoming');
    ws.once('message', message => {
        const str = message.toString();
        switch (str) {
            case 'SENDER':
                setSender(ws);
                break;
            case 'RECEIVER':
                addReceiver(ws)
                break;
            default:
                console.log('Unknown register code: ' + str);
                break;
        }
    });
});

console.log('READY');

function addReceiver(ws: WebSocket) {
    console.log('RECEIVER registered');
    for (const path of paths) {
        ws.send('START');
        path.forEach(c => ws.send(JSON.stringify(c)));
        ws.send('STOP');
    }

    receivers.push(ws);

    ws.onclose = () => {
        // Remove receiver when connection closes
        for (const [i, recv] of receivers.entries()) {
            if (ws === recv) {
                receivers.splice(i, 1);
            }
        }
    };
}

function setSender(ws: WebSocket) {
    console.log('SENDER is being registered')
    if (sender) {
        console.log('Removing current sender...')
        sender.close();
        clearPaths();
    }

    sender = ws;
    ws.on('message', msg => processMessage(msg));
}

function processMessage(message: WebSocket.Data) {
    const text = message.toString();
    switch (text) {
        case 'START':
            startPath();
            break;
        case 'STOP':
            finishPath();
            break;
        default:
            processCoordinates(text);
            break;
    }
}

function processCoordinates(text: string) {
    console.log('COORDINATES received: ' + text);

    console.log('SENDING to ' + receivers.length, 'clients');
    receivers.forEach(r => r.send(text));

    currentPath.push(JSON.parse(text));
}

function startPath() {
    currentPath = [];
    receivers.forEach(r => r.send('START'));
}

function finishPath() {
    paths.push(currentPath);
    receivers.forEach(r => r.send("STOP"));
}

function clearPaths() {
    paths.splice(0, paths.length);
    receivers.forEach(r => r.send('CLEAR'));
    console.log('Paths have been cleared');
}
