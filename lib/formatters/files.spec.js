import {test} from 'supertape';
import {
    formatLines,
    getLinesPercent,
} from './files.js';

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
