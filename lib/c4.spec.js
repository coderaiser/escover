import {test} from 'supertape';
import {
    getFileEntries,
    __fileEntries,
} from './c4.js';

test('escover: getFiles', (t) => {
    t.equal(getFileEntries(), __fileEntries);
    t.end();
});

