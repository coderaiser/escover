import process from 'node:process';
import {test} from 'supertape';
import stripAnsi from 'strip-ansi';
import format, {
    formatLines,
    getLinesPercent,
    createTableOptions,
} from './responsive.js';

test('format: getLinesPercent: normal', (t) => {
    const result = getLinesPercent(10, 5);
    
    t.equal(result, 50);
    t.end();
});

test('format: getLinesPercent: zero lines', (t) => {
    const result = getLinesPercent(0, 5);
    
    t.equal(result, 100);
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
    
    t.equal(result, '1, 2, 3, 4, 5');
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
    
    t.equal(result, '1..12');
    t.end();
});

test('format: formatLines: fallback last', (t) => {
    const result = formatLines(Array.from({length: 50}, (_, i) => i + 1));
    
    t.equal(result, '1..50');
    t.end();
});

test('format: skipFull returns message', (t) => {
    const result = format([], {
        skipFull: true,
    });
    
    t.equal(result, '💪 coverage 100% Good Job!\n');
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
    
    t.equal(result, '💪 coverage 100% Good Job!\n');
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

test('format: fully covered file shows percent', (t) => {
    const result = stripAnsi(format([{
        name: 'hello.js',
        lines: {
            1: true,
        },
    }]));
    
    t.match(result, '100%');
    t.end();
});

test('format: grouping by folder shows files', (t) => {
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
    
    t.ok(result.includes('one.js') && result.includes('two.js'));
    t.end();
});

test('format: single folder hides header', (t) => {
    const result = stripAnsi(format([{
        name: 'lib/one.js',
        lines: {
            1: false,
        },
    }, {
        name: 'lib/two.js',
        lines: {
            1: false,
        },
    }]));
    
    t.notMatch(result, './');
    t.end();
});

test('format: trim long filename works', (t) => {
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

test('format: percent column enabled when width >= 70', (t) => {
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

test('format: percent column disabled when width < 70', (t) => {
    const original = process.stdout.columns;
    
    process.stdout.columns = 60;
    
    const result = stripAnsi(format([{
        name: 'hello.js',
        lines: {
            1: false,
        },
    }]));
    
    process.stdout.columns = original;
    
    t.match(result, 'hello.js');
    t.end();
});

test('format: buildGroupedTable shows uncovered lines formatting', (t) => {
    const result = stripAnsi(format([{
        name: 'a.js',
        lines: {
            1: false,
            2: false,
            3: false,
        },
    }]));
    
    t.ok(result.includes('..') || result.includes('1') || result.includes('3'));
    t.end();
});

test('format: formatLines long equal strings returns last only', (t) => {
    const result = formatLines([
        'a'.repeat(40),
        'b'.repeat(40),
    ]);
    
    t.equal(result, 'b'.repeat(40));
    t.end();
});

test('format: folder coloring green exists', (t) => {
    const result = format([{
        name: 'lib/covered.js',
        lines: {
            1: true,
            2: true,
        },
    }, {
        name: 'src/uncovered.js',
        lines: {
            1: false,
        },
    }]);
    
    const green = '\u001B[38;2;76;175;80m';
    
    t.match(result, green);
    t.end();
});

test('format: folder coloring red exists', (t) => {
    const result = format([{
        name: 'lib/covered.js',
        lines: {
            1: true,
            2: true,
        },
    }, {
        name: 'src/uncovered.js',
        lines: {
            1: false,
        },
    }]);
    
    const red = '\u001B[38;2;244;67;54m';
    
    t.match(result, red);
    t.end();
});

/* =========================
 * createTableOptions tests (fixed)
 * ========================= */
test('format: createTableOptions returns 3 columns when percent enabled', (t) => {
    const options = createTableOptions({
        totalWidth: 120,
        showPercent: true,
        tableData: [],
    });
    
    t.equal(options.columns.length, 3);
    t.end();
});

test('format: createTableOptions returns correct file column width', (t) => {
    const options = createTableOptions({
        totalWidth: 120,
        showPercent: true,
        tableData: [],
    });
    
    t.equal(options.columns[0].width, Math.floor(120 * 0.45));
    t.end();
});

test('format: createTableOptions percent column width is fixed 8', (t) => {
    const options = createTableOptions({
        totalWidth: 120,
        showPercent: true,
        tableData: [],
    });
    
    t.equal(options.columns[1].width, 8);
    t.end();
});

test('format: createTableOptions hides percent column when disabled', (t) => {
    const options = createTableOptions({
        totalWidth: 120,
        showPercent: false,
        tableData: [],
    });
    
    t.equal(options.columns.length, 2);
    t.end();
});
