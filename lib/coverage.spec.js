import {readFileSync} from 'fs';
import {createMockImport} from 'mock-import';
import {
    test,
    stub,
} from 'supertape';
import {write} from './coverage.js';

const {
    mockImport,
    stopAll,
    reImport,
} = createMockImport(import.meta.url);

const {stringify} = JSON;

test('escover: coverage: read: empty', async (t) => {
    const fileEntries = new Map();
    
    const getFileEntries = stub().returns(fileEntries);
    const readFileSync = stub();
    
    mockImport('./c4.js', {
        getFileEntries,
    });
    
    mockImport('fs', {
        readFileSync,
    });
    
    const {write} = await reImport('./coverage');
    write();
    
    stopAll();
    
    t.notCalled(readFileSync);
    t.end();
});

test('escover: coverage: read', async (t) => {
    const findCacheDir = stub().returns('cache');
    const fileEntries = new Map();
    const places = new Map();
    
    places.set('17:18', false);
    fileEntries.set('hello.js', places);
    
    const getFileEntries = stub().returns(fileEntries);
    const writeFileSync = stub();
    
    mockImport('./c4.js', {
        getFileEntries,
    });
    
    mockImport('fs', {
        writeFileSync,
    });
    
    mockImport('find-cache-dir', findCacheDir);
    
    const {write} = await reImport('./coverage.js');
    write();
    stopAll();
    
    const expected = ['cache/escover.json', stringify([{
        name: 'hello.js',
        lines: {
            17: false,
        },
    }], null, 4)];
    
    t.calledWith(writeFileSync, expected);
    t.end();
});

