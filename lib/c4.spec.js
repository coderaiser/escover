import {createMockImport} from 'mock-import';
import {test} from 'supertape';
import {getFileEntries, __fileEntries} from './c4.js';

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

test('escover: getFiles: global: init', async (t) => {
    const {createFileEntry} = await reImport('./c4.js');
    const fileEntry = createFileEntry('hello.js');
    
    fileEntry.init(1, 2);
    fileEntry['🧨'](1, 2);
    
    const result = global
        .__fileEntries
        .get('hello.js')
        .get('1:2');
    
    global.__fileEntries.delete('hello.js');
    
    t.ok(result);
    t.end();
});

test('escover: getFiles: global: no fileEntry', async (t) => {
    const {__fileEntries} = global;
    delete global.__fileEntries;
    const {createFileEntry} = await reImport('./c4.js');
    const fileEntry = createFileEntry('hello.js');
    
    fileEntry.init(1, 2);
    fileEntry['🧨'](1, 2);
    
    const result = global
        .__fileEntries
        .get('hello.js')
        .get('1:2');
    
    global.__fileEntries.delete('hello.js');
    global.__fileEntries = __fileEntries;
    
    t.ok(result);
    t.end();
});
