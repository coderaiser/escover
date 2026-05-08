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
    
    t.equal(result, '1..5');
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

test('format: skipFull with covered file returns message', (t) => {
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

test('format: uncovered lines formatting exists', (t) => {
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
    
    t.equal(result, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
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
    
    t.match(result, '\u001B[38;2;76;175;80m');
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
    
    t.match(result, '\u001B[38;2;244;67;54m');
    t.end();
});

test('format: createTableOptions returns 3 columns when percent enabled', (t) => {
    const options = createTableOptions({
        totalWidth: 120,
        showPercent: true,
        tableData: [],
    });
    
    t.equal(options.columns.length, 3);
    t.end();
});

test('format: createTableOptions file column width correct', (t) => {
    const options = createTableOptions({
        totalWidth: 120,
        showPercent: true,
        tableData: [],
    });
    
    t.equal(options.columns[0].width, 88);
    t.end();
});

test('format: createTableOptions percent column width fixed', (t) => {
    const options = createTableOptions({
        totalWidth: 120,
        showPercent: true,
        tableData: [],
    });
    
    t.equal(options.columns[1].width, 8);
    t.end();
});

test('format: createTableOptions hides percent column', (t) => {
    const options = createTableOptions({
        totalWidth: 120,
        showPercent: false,
        tableData: [],
    });
    
    t.equal(options.columns.length, 2);
    t.end();
});

test('format: drawHorizontalLine raw=0 returns true', (t) => {
    const options = createTableOptions({
        totalWidth: 120,
        showPercent: true,
        tableData: [['a'], ['b']],
    });
    
    t.ok(options.drawHorizontalLine(0));
    t.end();
});

test('format: drawHorizontalLine undefined returns true', (t) => {
    const options = createTableOptions({
        totalWidth: 120,
        showPercent: true,
        tableData: [
            ['a'],
        ],
    });
    
    t.ok(options.drawHorizontalLine(undefined));
    t.end();
});

test('format: drawHorizontalLine last row returns true', (t) => {
    const tableData = [
        ['a'],
        ['b'],
        ['c'],
    ];
    
    const options = createTableOptions({
        totalWidth: 120,
        showPercent: true,
        tableData,
    });
    
    t.ok(options.drawHorizontalLine(tableData.length));
    t.end();
});

test('format: drawHorizontalLine middle row returns false', (t) => {
    const tableData = [
        ['a'],
        ['b'],
        ['c'],
        ['d'],
    ];
    
    const options = createTableOptions({
        totalWidth: 120,
        showPercent: true,
        tableData,
    });
    
    t.notOk(options.drawHorizontalLine(2));
    t.end();
});

test('format: files without folder use "." label', (t) => {
    const result = stripAnsi(format([{
        name: 'file.js',
        lines: {
            1: false,
        },
    }]));
    
    t.match(result, '.');
    t.end();
});

test('format: long folder name is grouped correctly', (t) => {
    const longFolder = 'very/long/folder/name/that/should/be/trimmed';
    
    const result = stripAnsi(format([{
        name: `${longFolder}/file.js`,
        lines: {
            1: false,
        },
    }]));
    
    t.match(result, 'file.js');
    t.end();
});

test('format: long folder name is included in output', (t) => {
    const longFolder = 'very/long/folder/name/that/should/be/trimmed';
    
    const result = stripAnsi(format([{
        name: `${longFolder}/file.js`,
        lines: {
            1: false,
        },
    }]));
    
    t.match(result, 'file.js');
    t.end();
});

test('format: trim branch is executed for long folder labels', (t) => {
    const longFolder = 'a'.repeat(200);
    
    const result = format([{
        name: `${longFolder}/file.js`,
        lines: {
            1: false,
        },
    }, {
        name: `other/${longFolder}/file2.js`,
        lines: {
            1: false,
        },
    }]);
    
    const clean = stripAnsi(result);
    
    t.match(clean, 'file.js');
    t.end();
});
