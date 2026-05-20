import {test} from 'supertape';
import {montag} from 'montag';
import {help} from './help.js';

test('escover: cli: help', (t) => {
    const result = help();
    const expected = montag`
      Usage: escover [options] [script]
      Options:
        --skip-full             show only uncovered
        -h, --help              display this help and exit
        -v, --version           output version information and exit
    `;
    
    t.equal(result, expected);
    t.end();
});
