import {montag} from 'montag';
import {test, stub} from 'supertape';
import {readCoverage, writeCoverage} from './coverage-file.js';

const {isArray} = Array;

test('escover: coverage-file: write: empty', (t) => {
    const fileEntries = new Map();
    
    const getFiles = stub().returns(fileEntries);
    const write = stub();
    
    writeCoverage({
        write,
        getFiles,
    });
    
    t.notCalled(write);
    t.end();
});

test('escover: coverage-file: writeCoverage', (t) => {
    const createCovDir = stub().returns('cache');
    const files = new Map();
    const places = new Map();
    
    places.set('17:18', false);
    files.set('hello.js', places);
    
    const getFiles = stub().returns(files);
    const write = stub();
    
    writeCoverage({
        createCovDir,
        write,
        getFiles,
    });
    
    const lcov = montag`
        SF:hello.js
        DA:17,0
        end_of_record
    `;
    
    const expected = ['cache/lcov.info', lcov];
    
    t.calledWith(write, expected);
    t.end();
});

test('escover: coverage-file: read', (t) => {
    const result = readCoverage();
    
    t.ok(isArray(result));
    t.end();
});

test('escover: coverage-file: read: error', (t) => {
    const read = stub().throws(Error('x'));
    const result = readCoverage({
        read,
    });
    
    const expected = [];
    
    t.deepEqual(result, expected);
    t.end();
});

test('escover: coverage-file: read: data', (t) => {
    const read = stub().returns(montag`
        SF:/abc.js
        DA:1,0'
        end_of_record
    `);
    
    const result = readCoverage({
        read,
    });
    
    const expected = [{
        name: '/abc.js',
        lines: {
            1: false,
        },
    }];
    
    t.deepEqual(result, expected);
    t.end();
});
