import {createMockImport} from 'mock-import';
import {
    test,
    stub,
} from 'supertape';

const {
    mockImport,
    stopAll,
    reImport,
} = createMockImport(import.meta.url);

const {stringify} = JSON;

const {isArray} = Array;

test('escover: coverage-file: write: empty', async (t) => {
    const fileEntries = new Map();
    
    const getFileEntries = stub().returns(fileEntries);
    const readFileSync = stub();
    
    mockImport('./c4.js', {
        getFileEntries,
    });
    
    mockImport('fs', {
        readFileSync,
    });
    
    const {write} = await reImport('./coverage-file');
    write();
    
    stopAll();
    
    t.notCalled(readFileSync);
    t.end();
});

test('escover: coverage-file: write', async (t) => {
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
    
    const {write} = await reImport('./coverage-file.js');
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

test('escover: coverage-file: read', async (t) => {
    const {read} = await reImport('./coverage-file');
    
    const result = read();
    stopAll();
    
    t.ok(isArray(result));
    t.end();
});

test('escover: coverage-file: read: error', async (t) => {
    const readFileSync = stub().throws(Error('x'));
    mockImport('fs', {
        readFileSync,
    });
    const {read} = await reImport('./coverage-file');
    
    const result = read();
    const expected = [];
    
    stopAll();
    
    t.deepEqual(result, expected);
    t.end();
});

test('escover: coverage-file: read: data', async (t) => {
    const readFileSync = stub().returns(stringify([{
        name: '/abc.js',
        lines: {
            1: false,
        },
    }]));
    mockImport('fs', {
        readFileSync,
    });
    const {read} = await reImport('./coverage-file');
    
    const result = read();
    const expected = [{
        name: '/abc.js',
        lines: {
            1: false,
        },
    }];
    
    stopAll();
    
    t.deepEqual(result, expected);
    t.end();
});
