import {
    fileURLToPath,
    pathToFileURL,
} from 'node:url';
import assert from 'node:assert';
import {register} from 'node:module';
import {MessageChannel} from 'node:worker_threads';

// This example showcases how a message channel can be used to communicate
// between the main (application) thread and the hooks running on the hooks
// thread, by sending `port2` to the `initialize` hook.
const __filename = fileURLToPath(import.meta.url);
// This example showcases how a message channel can be used to communicate
// between the main (application) thread and the hooks running on the hooks
// thread, by sending `port2` to the `initialize` hook.
const {port1, port2} = new MessageChannel();

port1.on('message', (msg) => {
    assert.strictEqual(msg, 'increment: 2');
});

register('./escover.js', {
    parentURL: pathToFileURL(__filename),
    data: {
        number: 1,
        port: port2,
    },
    transferList: [port2],
});

