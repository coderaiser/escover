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
    const writeFileSync = stub();
    
    mockImport('../c4.js', {
        getFileEntries,
    });
    
    mockImport('fs', {
        readFileSync,
        writeFileSync,
    });
    
    const {writeCoverage} = await reImport('./coverage-file');
    writeCoverage();
    
    stopAll();
    
    t.notCalled(readFileSync);
    t.end();
});

test('escover: coverage-file: writeCoverage', async (t) => {
    const findCacheDir = stub().returns('cache');
    const fileEntries = new Map();
    const places = new Map();
    
    places.set('17:18', false);
    fileEntries.set('hello.js', places);
    
    const getFileEntries = stub().returns(fileEntries);
    const writeFileSync = stub();
    const mkdirSync = stub();
    
    mockImport('../c4.js', {
        getFileEntries,
    });
    
    mockImport('fs', {
        writeFileSync,
        mkdirSync,
    });
    
    mockImport('./find-cache-dir', {findCacheDir});
    
    const {writeCoverage} = await reImport('./coverage-file.js');
    writeCoverage();
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
    const {readCoverage} = await reImport('./coverage-file');
    
    const result = readCoverage();
    stopAll();
    
    t.ok(isArray(result));
    t.end();
});

test('escover: coverage-file: read: error', async (t) => {
    const readFileSync = stub().throws(Error('x'));
    const mkdirSync = stub();
    
    mockImport('fs', {
        readFileSync,
        mkdirSync,
    });
    const {readCoverage} = await reImport('./coverage-file');
    
    const result = readCoverage();
    const expected = [];
    
    stopAll();
    
    t.deepEqual(result, expected);
    t.end();
});

test('escover: coverage-file: read: data', async (t) => {
    const mkdirSync = stub();
    const readFileSync = stub().returns(stringify([{
        name: '/abc.js',
        lines: {
            1: false,
        },
    }]));
    
    mockImport('fs', {
        mkdirSync,
        readFileSync,
    });
    const {readCoverage} = await reImport('./coverage-file');
    
    const result = readCoverage();
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
