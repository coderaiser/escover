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
    const expected = '...';
    
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
