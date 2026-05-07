import process from 'node:process';
import {test} from 'supertape';
import {
    isSuccess,
    ESCOVER_NODE_OPTIONS,
} from './cli.js';

test('escover: cli: isSuccess: no', (t) => {
    process.env.ESCOVER_SUCCESS_EXIT_CODE = '1';
    
    const result = isSuccess({
        status: 5,
    });
    
    delete process.env.ESCOVER_SUCCESS_EXIT_CODE;
    
    t.notOk(result);
    t.end();
});

test('escover: cli: isSuccess: yes', (t) => {
    process.env.ESCOVER_SUCCESS_EXIT_CODE = '5';
    
    const result = isSuccess({
        status: 5,
    });
    
    delete process.env.ESCOVER_SUCCESS_EXIT_CODE;
    
    t.ok(result);
    t.end();
});

test('escover: cli: NODE_OPTIONS: with quotes', (t) => {
    t.equal(ESCOVER_NODE_OPTIONS, '--import escover/register');
    t.end();
});
