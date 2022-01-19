import {test} from 'supertape';
import montag from 'montag';
import {createLcov} from './lcov.js';

test('escover: coverage-file: lcov', (t) => {
    const files = [{
        name: 'hello.js',
        lines: {
            1337: true,
        },
    }, {
        name: 'world.js',
        lines: {
            1: true,
        },
    }];
    const result = createLcov(files);
    const expected = montag`
        SF:hello.js
        DA:1337,1
        SF:world.js
        DA:1,1
        end_of_record
    `;
    
    t.equal(result, expected);
    t.end();
});

test('escover: coverage-file: lcov: not covered', (t) => {
    const files = [{
        name: 'hello.js',
        lines: {
            1337: false,
        },
    }];
    const result = createLcov(files);
    const expected = montag`
        SF:hello.js
        DA:1337,0
        end_of_record
    `;
    
    t.equal(result, expected);
    t.end();
});

