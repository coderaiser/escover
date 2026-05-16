import {test} from 'supertape';
import {parseUncoveredLines} from './parser.js';

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
