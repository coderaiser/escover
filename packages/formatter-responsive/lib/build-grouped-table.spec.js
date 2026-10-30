import {stripVTControlCharacters as stripAnsi} from 'node:util';
import {test} from 'supertape';
import {
    buildGroupedTable,
    getColor,
} from './build-grouped-table.js';

test('buildGroupedTable: single group hides folder header', (t) => {
    const files = [{
        filename: 'lib/a.js',
        covered: false,
        lines: [1],
        percentLines: 50,
    }, {
        filename: 'lib/b.js',
        covered: true,
        lines: [],
        percentLines: 100,
    }];
    
    const [result] = buildGroupedTable({
        files,
        showPercent: false,
        linesColWidth: 20,
    });
    
    const expected = [
        'File',
        'Uncovered Lines #s',
    ];
    
    t.deepEqual(result, expected);
    t.end();
});

test('buildGroupedTable: single group: nested: do not hide folder header', (t) => {
    const files = [{
        filename: 'lib/c/d/a.js',
        covered: false,
        lines: [1],
        percentLines: 50,
    }, {
        filename: 'lib/c/d/b.js',
        covered: true,
        lines: [],
        percentLines: 100,
    }];
    
    const [, result] = buildGroupedTable({
        files,
        showPercent: false,
        linesColWidth: 20,
        fileColWidth: 20,
    });
    
    const first = stripAnsi(result[0]);
    const expected = 'lib/c/d';
    
    t.equal(first, expected);
    t.end();
});

test('buildGroupedTable: tiny file column: file name is replaced with ellipsis', (t) => {
    const files = [{
        filename: 'lib/a.js',
        covered: false,
        lines: [1],
        percentLines: 50,
    }];
    
    const [, [column]] = buildGroupedTable({
        files,
        showPercent: false,
        linesColWidth: 20,
        fileColWidth: 3,
    });
    
    const result = stripAnsi(column);
    const expected = ' ...';
    
    t.equal(result, expected);
    t.end();
});

test('formatter: responsive: getColor', (t) => {
    const fn = getColor(100);
    const result = stripAnsi(fn('hello'));
    const expected = 'hello';
    
    t.equal(result, expected);
    t.end();
});

test('buildGroupedTable: without percent column', (t) => {
    const files = [{
        filename: 'lib/index.js',
        covered: false,
        lines: [1, 2],
        percentLines: 50,
    }];
    
    const [first, second] = buildGroupedTable({
        files,
        showPercent: false,
        linesColWidth: 20,
        fileColWidth: 20,
    });
    
    const expected = [
        ['File', 'Uncovered Lines #s'],
        [` ${stripAnsi(getColor(50)('index.js'))}`, stripAnsi(getColor(50)('1..2'))],
    ];
    
    const normalized = [
        first,
        [
            stripAnsi(second[0]),
            stripAnsi(second[1]),
        ],
    ];
    
    t.deepEqual(normalized, expected);
    t.end();
});

test('buildGroupedTable: without lines column: header', (t) => {
    const files = [{
        filename: 'lib/index.js',
        covered: true,
        lines: [],
        percentLines: 100,
    }];
    
    const expected = ['File'];
    
    const [result] = buildGroupedTable({
        files,
        showPercent: false,
        linesColWidth: 0,
        fileColWidth: 20,
    });
    
    t.deepEqual(result, expected);
    t.end();
});

test('buildGroupedTable: without lines column: file row has only name', (t) => {
    const files = [{
        filename: 'lib/index.js',
        covered: true,
        lines: [],
        percentLines: 100,
    }];
    
    const [, row] = buildGroupedTable({
        files,
        showPercent: false,
        linesColWidth: 0,
        fileColWidth: 20,
    });
    
    const result = row.map(stripAnsi);
    const expected = [' index.js'];
    
    t.deepEqual(result, expected);
    t.end();
});

test('buildGroupedTable: without lines column: folder row has only name and percent', (t) => {
    const files = [{
        filename: 'lib/a/index.js',
        covered: true,
        lines: [],
        percentLines: 100,
    }];
    
    const [, row] = buildGroupedTable({
        files,
        showPercent: true,
        linesColWidth: 0,
        fileColWidth: 20,
    });
    
    const result = row.map(stripAnsi);
    const expected = [
        'lib/a',
        '100%',
    ];
    
    t.deepEqual(result, expected);
    t.end();
});

test('buildGroupedTable: lines header: shortened to fit the column', (t) => {
    const files = [{
        filename: 'lib/index.js',
        covered: true,
        lines: [],
        percentLines: 100,
    }];
    
    const headers = [];
    
    for (const linesColWidth of [
        18,
        17,
        9,
        8,
        5,
        4,
        1,
    ]) {
        const [[, header]] = buildGroupedTable({
            files,
            showPercent: false,
            linesColWidth,
            fileColWidth: 20,
        });
        
        headers.push(header);
    }
    
    const expected = [
        'Uncovered Lines #s',
        'Uncovered',
        'Uncovered',
        'Lines',
        'Lines',
        '',
        '',
    ];
    
    t.deepEqual(headers, expected);
    t.end();
});

test('buildGroupedTable: truncate long file name: keeps beginning and end', (t) => {
    const files = [{
        filename: 'lib/very-long-file-name-example.js',
        covered: true,
        lines: [],
        percentLines: 100,
    }, {
        filename: 'src/another.js',
        covered: true,
        lines: [],
        percentLines: 100,
    }];
    
    const [, , [column]] = buildGroupedTable({
        files,
        showPercent: true,
        linesColWidth: 20,
        fileColWidth: 10,
    });
    
    const normalized = stripAnsi(column);
    const expected = ' ver....js';
    
    t.equal(normalized, expected);
    t.end();
});

test('buildGroupedTable: file name that fills the column is not truncated and does not wrap', (t) => {
    const files = [{
        filename: 'lib/printer.js',
        covered: true,
        lines: [],
        percentLines: 100,
    }];
    
    const [, [column]] = buildGroupedTable({
        files,
        showPercent: false,
        linesColWidth: 0,
        fileColWidth: 11,
    });
    
    const normalized = stripAnsi(column);
    
    t.equal(normalized, ' printer.js');
    t.end();
});

test('buildGroupedTable: truncate long folder name: keeps beginning and end', (t) => {
    const files = [{
        filename: '/very/long/path/to/folder/file.js',
        covered: true,
        lines: [],
        percentLines: 100,
    }, {
        filename: '/another/folder/another.js',
        covered: true,
        lines: [],
        percentLines: 100,
    }];
    
    const [, [column]] = buildGroupedTable({
        files,
        showPercent: true,
        linesColWidth: 20,
        fileColWidth: 10,
    });
    
    const result = stripAnsi(column);
    const expected = '/ver...der';
    
    t.equal(result, expected);
    t.end();
});
