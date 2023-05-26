import {test} from 'supertape';
import {readFile} from 'fs/promises';
import {
    isSuccess,
    ESCOVER_NODE_OPTIONS,
} from './cli.js';

const {keys} = Object;

const {parse} = JSON;

test('escover: cli: mock-import should be in dependencies, since zenload uses it', async (t) => {
    const packageJsonPath = new URL('../../package.json', import.meta.url).pathname;
    const {dependencies} = parse(await readFile(packageJsonPath, 'utf8'));
    const names = keys(dependencies);
    const result = names.includes('mock-import');
    
    t.ok(result);
    t.end();
});

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
    t.equal(ESCOVER_NODE_OPTIONS, '--no-warnings --loader zenload');
    t.end();
});
