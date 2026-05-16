import {stripVTControlCharacters as stripAnsi} from 'node:util';
import {test} from 'supertape';
import format, {
    getLinesPercent,
    createTableOptions,
    parseUncoveredLines,
} from './responsive.js';

test('getLinesPercent: normal', (t) => {
    const result = getLinesPercent(10, 5);
    const expected = 50;
    
    t.equal(result, expected);
    t.end();
});

test('getLinesPercent: zero lines', (t) => {
    const result = getLinesPercent(0, 5);
    const expected = 100;
    
    t.equal(result, expected);
    t.end();
});

test('format: skipFull returns message', (t) => {
    const result = format([], {
        skipFull: true,
    });
    
    const expected = '💪 coverage 100%, good job!\n';
    
    t.equal(result, expected);
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
    
    const expected = '💪 coverage 100%, good job!\n';
    
    t.equal(result, expected);
    t.end();
});

test('format: empty input returns table header', (t) => {
    const result = stripAnsi(format([]));
    
    t.match(result, 'File');
    t.end();
});

test('format: single uncovered file shows filename', (t) => {
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

test('format: fully covered file shows 100%', (t) => {
    const result = stripAnsi(format([{
        name: 'hello.js',
        lines: {
            1: true,
        },
    }]));
    
    t.match(result, '100%');
    t.end();
});

test('format: grouping by folder shows all filenames', (t) => {
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
    
    t.match(result, 'one.js');
    t.end();
});

test('format: single folder hides folder header', (t) => {
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
    
    t.notOk(result.includes('./'));
    t.end();
});

test('format: trim long filename shows actual file', (t) => {
    const longName = 'a/'.repeat(20) + 'file.js';
    const result = stripAnsi(format([{
        name: longName,
        lines: {
            1: false,
        },
    }]));
    
    t.match(result, 'file.js');
    t.end();
});

test('format: long folder name included in output', (t) => {
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

test('format: trim branch executed for multiple long folders', (t) => {
    const longFolder = 'a'.repeat(200);
    const result = stripAnsi(format([{
        name: `${longFolder}/file.js`,
        lines: {
            1: false,
        },
    }, {
        name: `other/${longFolder}/file2.js`,
        lines: {
            1: false,
        },
    }]));
    
    t.match(result, /file\.js[\s\S]*file2\.js/);
    t.end();
});

test('format: percent column enabled when width >= 70', (t) => {
    const overrides = {
        columns: 120,
    };
    
    const coverageFile = [{
        name: 'hello.js',
        lines: {
            1: false,
        },
    }];
    
    const result = stripAnsi(format(
        coverageFile,
        overrides,
    ));
    
    t.match(result, '%');
    t.end();
});

test('format: percent column disabled when width < 70', (t) => {
    const overrides = {
        columns: 60,
    };
    
    const coverageFile = [{
        name: 'hello.js',
        lines: {
            1: false,
        },
    }];
    
    const result = stripAnsi(format(
        coverageFile,
        overrides,
    ));
    
    t.match(result, 'hello.js');
    t.end();
});

test('createTableOptions: returns correct number of columns', (t) => {
    const result = createTableOptions({
        totalWidth: 120,
        showPercent: true,
        tableData: [],
    }).columns.length;
    
    const expected = 3;
    
    t.equal(result, expected);
    t.end();
});

test('createTableOptions: hides percent column if showPercent false', (t) => {
    const result = createTableOptions({
        totalWidth: 120,
        showPercent: false,
        tableData: [],
    }).columns.length;
    
    const expected = 2;
    
    t.equal(result, expected);
    t.end();
});

test('parseUncoveredLines: empty lines', (t) => {
    const result = parseUncoveredLines({});
    const expected = [];
    
    t.deepEqual(result, expected);
    t.end();
});

test('parseUncoveredLines: all covered', (t) => {
    const result = parseUncoveredLines({
        1: true,
        2: true,
    });
    
    const expected = [];
    
    t.deepEqual(result, expected);
    t.end();
});

test('createTableOptions: drawHorizontalLine logic', (t) => {
    const tableData = [
        ['a'],
        ['b'],
        ['c'],
        ['d'],
    ];
    
    const opts = createTableOptions({
        tableData,
        fileColWidth: 10,
        percentColWidth: 7,
        linesColWidth: 20,
        showPercent: true,
    });
    
    const result = opts.drawHorizontalLine(0) && opts.drawHorizontalLine(1) && opts.drawHorizontalLine(tableData.length);
    
    t.ok(result);
    t.end();
});
