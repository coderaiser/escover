import {test} from 'supertape';
import montag from 'montag';
import chalk from 'chalk';
import lines from './lines.js';

test('escover: formatter: lines', (t) => {
    const coverageFile = [{
        name: 'hello.js',
        lines: {
            1: true,
        },
    }];
    
    const result = lines(coverageFile);
    
    const expected = montag`
        # CAP version 13
        
        1..1
        # files: 1
        # covered: 1
        
        # 🌴 ok
    
    `;
    
    t.equal(result, expected);
    t.end();
});

test('escover: formatter: lines: not covered', (t) => {
    const coverageFile = [{
        name: 'hello.js',
        lines: {
            1: false,
        },
    }];
    
    const result = lines(coverageFile);
    
    const expected = montag`
        # CAP version 13
        
        # hello.js
       🧨 should be covered
       ---
       lines:
        ️- ${chalk.red(1)} at file://hello.js:1
        
        1..1
        # files: 1
        # covered: 0
        
        # 🧨 fail: 1
    
    `;
    
    t.equal(result, expected);
    t.end();
});

test('escover: formatter: lines: couple', (t) => {
    const coverageFile = [{
        name: 'hello.js',
        lines: {
            1: false,
            2: true,
        },
    }, {
        name: 'world.js',
        lines: {
            1: true,
        },
    }];
    
    const result = lines(coverageFile);
    
    const expected = montag`
        # CAP version 13
        
        # hello.js
       🧨 should be covered
       ---
       lines:
        ️- ${chalk.red(1)} at file://hello.js:1
        
        1..2
        # files: 2
        # covered: 1
        
        # 🧨 fail: 1
    
    `;
    
    t.equal(result, expected);
    t.end();
});
