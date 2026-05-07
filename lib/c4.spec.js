import {test} from 'supertape';
import {
    createFileEntry,
    getFileEntries,
    __fileEntries,
} from './c4.js';

test('escover: getFiles', (t) => {
    t.equal(getFileEntries(), __fileEntries);
    t.end();
});

test('escover: getFiles: global: init', (t) => {
    const fileEntry = createFileEntry('hello.js');
    
    fileEntry.init(1, 2);
    fileEntry['🧨'](1, 2);
    
    const result = globalThis.__fileEntries
        .get('hello.js')
        .get('1:2');
    
    globalThis.__fileEntries.delete('hello.js');
    
    t.ok(result);
    t.end();
});

test('escover: getFiles: global: no fileEntry', (t) => {
    const {__fileEntries} = globalThis;
    const fileEntry = createFileEntry('hello.js');
    
    fileEntry.init(1, 2);
    fileEntry['🧨'](1, 2);
    
    const result = globalThis.__fileEntries
        .get('hello.js')
        .get('1:2');
    
    globalThis.__fileEntries.delete('hello.js');
    globalThis.__fileEntries = __fileEntries;
    
    t.ok(result);
    t.end();
});
