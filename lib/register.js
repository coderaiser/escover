import {pathToFileURL} from 'node:url';
import { register } from 'node:module';
import { MessageChannel } from 'node:worker_threads';

const { port1, port2 } = new MessageChannel();

initialize({
    port: port1
});

register('./escover.js', import.meta.url, {
     parentURL: import.meta.url,
    data: { port: port2 },
    transferList: [port2],
});

function initialize({port}) {
    const loader = 'escover';
    
    global.__createC4 = (url) => ({
        '🧨': (line, column) => {
            port.postMessage({
                type: 'set',
                url,
                line,
                column,
                loader,
            });
        },
        'init': (line, column) => {
            port.postMessage({
                type: 'init',
                url,
                line,
                column,
                loader,
            });
        },
    });
}
