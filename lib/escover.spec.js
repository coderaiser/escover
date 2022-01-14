import {createMockImport} from 'mock-import';
import {
    test,
    stub,
} from 'supertape';

const {
    mockImport,
    stopAll,
    reImport,
} = createMockImport(import.meta.url);

test('escover: builtin', async (t) => {
    const defaultLoad = stub().returns({
        source: 'const a = 5;',
        format: 'builtin',
    });
    
    mockImport('./exit', {
        exit: stub(),
    });
    const {load} = await reImport('./escover.js');
    
    const context = {};
    const {format} = await load(import.meta.url, context, defaultLoad);
    
    stopAll();
    
    t.equal(format, 'builtin');
    t.end();
});

test('escover: exclude', async (t) => {
    const defaultLoad = stub().returns({
        source: 'const a = 5;',
        format: 'module',
    });
    
    mockImport('./exit', {
        exit: stub(),
    });
    const {load} = await reImport('./escover.js');
    
    const context = {};
    const {format} = await load('node_modules', context, defaultLoad);
    
    stopAll();
    
    t.equal(format, 'module');
    t.end();
});

test('escover: instrument', async (t) => {
    const defaultLoad = stub().returns({
        source: 'const a = 5;',
        format: 'module',
    });
    
    mockImport('./exit', {
        exit: stub(),
    });
    const {load} = await reImport('./escover.js');
    
    const context = {};
    const {format} = await load('escover.js', context, defaultLoad);
    
    stopAll();
    
    t.equal(format, 'module');
    t.end();
});

test('escover: exclude: fixture', async (t) => {
    const defaultLoad = stub().returns({
        source: 'const a = 5;',
        format: 'module',
    });
    
    mockImport('./exit', {
        exit: stub(),
    });
    const {load} = await reImport('./escover.js');
    
    const context = {};
    const {source} = await load('/users/fixture/madrun.mjs', context, defaultLoad);
    
    stopAll();
    
    const expected = 'const a = 5;';
    
    t.equal(source, expected);
    t.end();
});

test('escover: exclude: .madrun.js', async (t) => {
    const defaultLoad = stub().returns({
        source: 'const a = 5;',
        format: 'module',
    });
    
    mockImport('./exit', {
        exit: stub(),
    });
    const {load} = await reImport('./escover.js');
    
    const context = {};
    const {source} = await load('/users/.madrun.mjs', context, defaultLoad);
    
    stopAll();
    
    const expected = 'const a = 5;';
    
    t.equal(source, expected);
    t.end();
});

