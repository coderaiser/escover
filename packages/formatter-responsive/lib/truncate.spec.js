import {test} from 'supertape';
import {truncateMiddle} from './truncate.js';

test('escover: formatter-responsive: truncateMiddle: fits', (t) => {
    const result = truncateMiddle('printer.js', 20);
    
    t.equal(result, 'printer.js');
    t.end();
});

test('escover: formatter-responsive: truncateMiddle: exact fit', (t) => {
    const result = truncateMiddle('printer.js', 10);
    
    t.equal(result, 'printer.js');
    t.end();
});

test('escover: formatter-responsive: truncateMiddle: keeps beginning and end', (t) => {
    const result = truncateMiddle('printer.spec.js', 10);
    
    t.equal(result, 'prin....js');
    t.end();
});

test('escover: formatter-responsive: truncateMiddle: result is not longer than max', (t) => {
    const {length} = truncateMiddle('packages/nirguna/lib/printer', 16);
    
    t.equal(length, 16);
    t.end();
});

test('escover: formatter-responsive: truncateMiddle: no room for tail', (t) => {
    const result = truncateMiddle('a.js', 3);
    
    t.equal(result, '...');
    t.end();
});

test('escover: formatter-responsive: truncateMiddle: budget smaller than ellipsis', (t) => {
    const result = truncateMiddle('a.js', 2);
    
    t.equal(result, '...');
    t.end();
});
