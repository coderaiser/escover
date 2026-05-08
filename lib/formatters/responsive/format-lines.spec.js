import {test} from 'supertape';
import {formatLines} from './format-lines.js';

test('escover: formatters: responsive: formatLines: <= 10 items', (t) => {
    const result = formatLines([
        1,
        2,
        3,
        4,
        5,
    ]);
    
    const expected = '1..5';
    
    t.equal(result, expected);
    t.end();
});

test('escover: formatters: responsive: formatLines: > 10 items', (t) => {
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

test('formatLines: fallback last when too long', (t) => {
    const result = formatLines(Array.from({length: 50}, (_, i) => i + 1));
    const expected = '1..50';
    
    t.equal(result, expected);
    t.end();
});

test('escover: formatters: responsive: formatLines: couple groups', (t) => {
    const result = formatLines([
        1,
        2,
        4,
        5,
    ]);
    
    const expected = '1..2, 4..5';
    
    t.equal(result, expected);
    t.end();
});
