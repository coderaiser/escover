import {test} from 'supertape';
import stripAnsi from 'strip-ansi';

import formatFiles, {
    formatLines,
    getLinesPercent,
} from './files.js';

import {writeFileSync} from 'fs';

test('escover: format: files', (t) => {
    const result = formatLines([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const expected = '1, 2, 3, 4, 5, 6, 7, 8, 9, 10';
    
    t.equal(result, expected);
    t.end();
});

test('escover: format: files: more then 10', (t) => {
    const result = formatLines([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 58]);
    const expected = '1, 2, 3, 4, 5, 6, 7, 8, 9, 10..58';
    
    t.equal(result, expected);
    t.end();
});

test('escover: format: files: getPercentLinesPercent', (t) => {
    const result = getLinesPercent(10, 5);
    const expected = 50;
    
    t.equal(result, expected);
    t.end();
});

test('escover: format: files: getPercentLinesPercent: no lines count', (t) => {
    const result = getLinesPercent(0, 0);
    const expected = 100;
    
    t.equal(result, expected);
    t.end();
});

test('escover: format: files: formatFiles: empty', (t) => {
    const result = formatFiles([]);
    const expected = [
        '-----|---------|--------------------\n',
        'File | % Lines | Uncovered Lines #s \n',
        '-----|---------|--------------------\n',
    ].join('');
    
    t.equal(result, expected);
    t.end();
});

test('escover: format: files: formatFiles', (t) => {
    const files = [{
        name: 'hello.js',
        lines: {
            1: true,
            1337: false,
        },
    }];
    const result = stripAnsi(formatFiles(files));
    const expected = [
        '---------|---------|--------------------\n',
        'File     | % Lines | Uncovered Lines #s \n',
        '---------|---------|--------------------\n',
        'hello.js | 50      | 1337               \n',
        '---------|---------|--------------------\n',
    ].join('');
    
    t.equal(result, expected);
    t.end();
});

test('escover: format: files: covered', (t) => {
    const files = [{
        name: 'hello.js',
        lines: {
            1: true,
        },
    }];
    const result = stripAnsi(formatFiles(files));
    const expected = [
        '---------|---------|--------------------\n',
        'File     | % Lines | Uncovered Lines #s \n',
        '---------|---------|--------------------\n',
        'hello.js | 100     |                    \n',
        '---------|---------|--------------------\n',
    ].join('');
    
    writeFileSync('xxx.txt', result);
    
    t.equal(result, expected);
    t.end();
});

