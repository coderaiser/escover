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

test('buildGroupedTable: multiple groups shows folder header', (t) => {
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

test('buildGroupedTable: truncate long file name', (t) => {
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
    const expected = ' ...le.js';
    
    t.equal(normalized, expected);
    t.end();
});

test('buildGroupedTable: truncate long folder name', (t) => {
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
    const expected = '...older';
    
    t.match(result, expected);
    t.end();
});
