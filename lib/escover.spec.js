import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import montag from 'montag';
import {createMockImport} from 'mock-import';
import {
    test,
    stub,
} from 'supertape';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
    const {format} = await load(`${__dirname}/node_modules`, context, defaultLoad);
    
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
    const {format} = await load(`${__dirname}/escover.js`, context, defaultLoad);
    
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
    const {source} = await load(`${__dirname}/fixture/madrun.mjs`, context, defaultLoad);
    
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
    const {source} = await load(`${__dirname}/users/.madrun.mjs`, context, defaultLoad);
    
    stopAll();
    
    const expected = 'const a = 5;';
    
    t.equal(source, expected);
    t.end();
});

test('escover: exclude: .spec.mjs', async (t) => {
    const defaultLoad = stub().returns({
        source: 'const a = 5;',
        format: 'module',
    });
    
    mockImport('./exit', {
        exit: stub(),
    });
    
    const {load} = await reImport('./escover.js');
    
    const context = {};
    const {source} = await load(`${__dirname}/hello.spec.mjs`, context, defaultLoad);
    
    stopAll();
    
    const expected = 'const a = 5;';
    
    t.equal(source, expected);
    t.end();
});

test('escover: exclude: test/', async (t) => {
    const defaultLoad = stub().returns({
        source: 'const a = 5;',
        format: 'module',
    });
    
    mockImport('./exit', {
        exit: stub(),
    });
    
    const {load} = await reImport('./escover.js');
    
    const context = {};
    const {source} = await load(`${__dirname}/test/hello.mjs`, context, defaultLoad);
    
    stopAll();
    
    const expected = 'const a = 5;';
    
    t.equal(source, expected);
    t.end();
});

test('escover: transform', async (t) => {
    const defaultLoad = stub().returns({
        source: 'const a = 5;',
        format: 'module',
    });
    
    mockImport('./exit', {
        exit: stub(),
    });
    
    const {load} = await reImport('./escover.js');
    
    const context = {};
    const {source} = await load(`${__dirname}/abc/hello.mjs`, context, defaultLoad);
    
    stopAll();
    
    const expected = montag`
        const __c4 = global.__createC4
    `;
    
    t.match(source, expected);
    t.end();
});

test('escover: transform: buffer', async (t) => {
    const defaultLoad = stub().returns({
        source: Buffer.from('const a = 5;'),
        format: 'module',
    });
    
    mockImport('./exit', {
        exit: stub(),
    });
    
    const {load} = await reImport('./escover.js');
    
    const context = {};
    const {source} = await load(`${__dirname}/abc/hello.mjs`, context, defaultLoad);
    
    stopAll();
    
    const expected = montag`
        const __c4 = global.__createC4
    `;
    
    t.match(source, expected);
    t.end();
});

test('escover: transform: exclude: process.cwd()', async (t) => {
    const defaultLoad = stub().returns({
        source: 'const a = 5;',
        format: 'module',
    });
    
    mockImport('./exit', {
        exit: stub(),
    });
    
    const context = {};
    const {load} = await reImport('./escover.js');
    const {source} = await load(`/abc/hello.mjs`, context, defaultLoad);
    
    stopAll();
    
    const expected = montag`
        const a = 5;
    `;
    
    t.equal(source, expected);
    t.end();
});

test('escover: commonjs', async (t) => {
    const defaultLoad = stub().returns({
        source: 'const a = 5;',
        format: 'commonjs',
    });
    
    mockImport('./exit', {
        exit: stub(),
    });
    
    const {load} = await reImport('./escover.js');
    
    const context = {};
    const {format} = await load(import.meta.url, context, defaultLoad);
    
    stopAll();
    
    t.equal(format, 'commonjs');
    t.end();
});

test('escover: again', async (t) => {
    const defaultLoad = stub().returns({
        source: 'const __c4 = 5;',
        format: 'module',
    });
    
    mockImport('./exit', {
        exit: stub(),
    });
    
    const {load} = await reImport('./escover.js');
    
    const context = {};
    const {source} = await load(import.meta.url.replace('.spec', ''), context, defaultLoad);
    
    stopAll();
    
    t.equal(source, 'const __c4 = 5;');
    t.end();
});

test('escover: globalPreload: port', async (t) => {
    mockImport('./exit', {
        exit: stub(),
    });
    
    const {globalPreload} = await reImport('./escover.js');
    const port = {};
    
    globalPreload({
        port,
    });
    stopAll();
    
    t.ok(port.onmessage, 'node v20 support');
    t.end();
});

test('escover: globalPreload', async (t) => {
    mockImport('./exit', {
        exit: stub(),
    });
    
    const {globalPreload} = await reImport('./escover.js');
    const port = {};
    
    const result = globalPreload({
        port,
    });
    
    stopAll();
    
    t.ok(result);
    t.end();
});
