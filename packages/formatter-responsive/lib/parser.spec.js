import {test} from 'supertape';
import {
    getLinesPercent,
    parseUncoveredLines,
} from './parser.js';

test('escover: formatter-responsive: parseUncoveredLines: empty lines', (t) => {
    const result = parseUncoveredLines({});
    const expected = [];
    
    t.deepEqual(result, expected);
    t.end();
});

test('escover: formatter-responsive: parseUncoveredLines: all covered', (t) => {
    const result = parseUncoveredLines({
        1: true,
        2: true,
    });
    
    const expected = [];
    
    t.deepEqual(result, expected);
    t.end();
});

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
