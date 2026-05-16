import {test} from 'supertape';
import {createTableOptions} from './table.js';

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
