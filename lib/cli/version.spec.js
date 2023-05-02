import {test} from 'supertape';
import {version} from './version.js';

test('escover: cli: version', (t) => {
    t.match(version(), /^\d+\.\d+.\d+$/);
    t.end();
});
