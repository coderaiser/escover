import {createMockImport} from 'mock-import';
import {test} from 'supertape';
import {
    getFileEntries,
    __fileEntries,
} from './c4.js';

const {reImport} = createMockImport(import.meta.url);

test('escover: getFiles', (t) => {
    t.equal(getFileEntries(), __fileEntries);
    t.end();
});

test('escover: getFiles: global', async (t) => {
    const {getFileEntries} = await reImport('./c4.js');
    
    t.equal(getFileEntries(), __fileEntries);
    t.end();
});

