import process from 'node:process';
import {test, stub} from 'supertape';
import {
    createNodeOptions,
    execute,
    isSuccess,
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
    t.equal(createNodeOptions('--abc'), '--import escover/register --abc');
    t.end();
});

test('escover: cli: execute: no quotes', (t) => {
    const env = {};
    const exit = stub();
    const cmd = ['tape', `'lib/**/*.spec.js'`];
    const run = stub();
    
    execute(cmd, {
        env,
        exit,
        run,
    });
    
    const args = [`"tape" "'lib/**/*.spec.js'"`, {
        env: {
            NODE_OPTIONS: '--import escover/register --unhandled-rejections=strict',
        },
        stdio: 'inherit',
    }];
    
    t.calledWith(run, args);
    t.end();
});

test('escover: cli: execute: quotes', (t) => {
    const env = {};
    const exit = stub();
    const cmd = [`tape 'test/*.js' 'lib/**/*.spec.js'`];
    const run = stub();
    
    execute(cmd, {
        env,
        exit,
        run,
    });
    
    const args = [`tape 'test/*.js' 'lib/**/*.spec.js'`, {
        env: {
            NODE_OPTIONS: '--import escover/register --unhandled-rejections=strict',
        },
        stdio: 'inherit',
    }];
    
    t.calledWith(run, args);
    t.end();
});
