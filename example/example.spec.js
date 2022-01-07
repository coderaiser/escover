import {test} from 'supertape';
import {sum} from './example.js';

test('c4: example: sum', (t) => {
    const result = sum(1, 2);
    
    t.equal(result, 3);
    t.end();
});

