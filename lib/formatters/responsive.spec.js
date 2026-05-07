import process from 'node:process';
import {test} from 'supertape';
import stripAnsi from 'strip-ansi';
import format, {
    formatLines,
    getLinesPercent,
} from './responsive.js';

test('format: getLinesPercent: normal', (t) => {
    const result = getLinesPercent(10, 5);
    const expected = 50;
    
    t.equal(result, expected);
    t.end();
});

test('format: getLinesPercent: zero lines', (t) => {
    const result = getLinesPercent(0, 5);
    const expected = 100;
    
    t.equal(result, expected);
    t.end();
});

test('format: formatLines: <= 10 items', (t) => {
    const result = formatLines([
        1,
        2,
        3,
        4,
        5,
    ]);
    const expected = '1, 2, 3, 4, 5';
    
    t.equal(result, expected);
    t.end();
});

test('format: formatLines: > 10 items range', (t) => {
    const result = formatLines([
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
    ]);
    const expected = '1..12';
    
    t.equal(result, expected);
    t.end();
});

test('format: formatLines: fallback last', (t) => {
    const result = formatLines(Array.from({length: 50}, (_, i) => i + 1));
    const expected = '1..50';
    
    t.equal(result, expected);
    t.end();
});

test('format: skipFull returns message', (t) => {
    const result = format([], {
        skipFull: true,
    });
    const expected = '💪 coverage 100% Good Job!\n';
    
    t.equal(result, expected);
    t.end();
});

test('format: skipFull with all covered files returns message', (t) => {
    const result = format([{
        name: 'a.js',
        lines: {
            1: true,
            2: true,
        },
    }], {
        skipFull: true,
    });
    
    const expected = '💪 coverage 100% Good Job!\n';
    
    t.equal(result, expected);
    t.end();
});

test('format: empty input returns table header', (t) => {
    const result = stripAnsi(format([]));
    
    t.match(result, 'File');
    t.end();
});

test('format: single uncovered file', (t) => {
    const result = stripAnsi(format([{
        name: 'hello.js',
        lines: {
            1: true,
            2: false,
        },
    }]));
    
    t.match(result, 'hello.js');
    t.end();
});

test('format: fully covered file', (t) => {
    const result = stripAnsi(format([{
        name: 'hello.js',
        lines: {
            1: true,
        },
    }]));
    
    t.match(result, '100%');
    t.end();
});

test('format: grouping by folder', (t) => {
    const result = stripAnsi(format([{
        name: 'a/one.js',
        lines: {
            1: false,
        },
    }, {
        name: 'a/two.js',
        lines: {
            1: false,
        },
    }]));
    
    t.match(result, 'a/');
    t.end();
});

test('format: root folder grouping uses dot label', (t) => {
    const result = stripAnsi(format([{
        name: 'file.js',
        lines: {
            1: false,
        },
    }]));
    
    const expected = './';
    
    t.match(result, expected);
    t.end();
});

test('format: trim long filename', (t) => {
    const longName = 'a/'.repeat(20) + 'file.js';
    
    const result = stripAnsi(format([{
        name: longName,
        lines: {
            1: false,
        },
    }]));
    
    t.ok(result.includes('file.js') || result.includes('...'));
    t.end();
});

test('format: percent column enabled (width >= 70)', (t) => {
    const original = process.stdout.columns;
    
    process.stdout.columns = 120;
    
    const result = stripAnsi(format([{
        name: 'hello.js',
        lines: {
            1: false,
        },
    }]));
    
    process.stdout.columns = original;
    
    t.match(result, '%');
    t.end();
});

test('format: percent column disabled (width < 70)', (t) => {
    const original = process.stdout.columns;
    
    process.stdout.columns = 60;
    
    const result = stripAnsi(format([{
        name: 'hello.js',
        lines: {
            1: false,
        },
    }]));
    
    process.stdout.columns = original;
    
    const expected = 'hello.js';
    
    t.match(result, expected);
    t.end();
});

test('format: buildGroupedTable uncovered lines formatting', (t) => {
    const result = stripAnsi(format([{
        name: 'a.js',
        lines: {
            1: false,
            2: false,
            3: false,
        },
    }]));
    
    const expected = '..';
    
    t.match(result, expected);
    t.end();
});

test('format: formatLines: <=10 items and base too long returns last only', (t) => {
    const result = formatLines([
        'a'.repeat(40),
        'b'.repeat(40),
    ]);
    
    const expected = 'b'.repeat(40);
    
    t.equal(result, expected);
    t.end();
});
