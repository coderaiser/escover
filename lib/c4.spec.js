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
    const fileEntry = createFileEntry('/global/init/hello.js');
    
    fileEntry.init(1, 2);
    fileEntry['🧨'](1, 2);
    
    const result = globalThis.__fileEntries
        .get('/global/init/hello.js')
        .get('1:2');
    
    globalThis.__fileEntries.delete('/global/init/hello.js');
    
    t.ok(result);
    t.end();
});

test('escover: getFiles: global: no fileEntry', (t) => {
    const fileEntry = createFileEntry('/zzz/hello.js');
    
    fileEntry.init(1, 2);
    fileEntry['🧨'](1, 2);
    
    const result = globalThis.__fileEntries
        .get('/zzz/hello.js')
        .get('1:2');
    
    globalThis.__fileEntries.delete('/zzz/hello.js');
    
    t.ok(result);
    t.end();
});
