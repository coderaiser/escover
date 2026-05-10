import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {Buffer} from 'node:buffer';
import {montag} from 'montag';
import {test, stub} from 'supertape';
import {load} from './escover.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

test('escover: builtin', async (t) => {
    const defaultLoad = stub().returns({
        source: 'const a = 5;',
        format: 'builtin',
    });
    
    const context = {};
    const {format} = await load(import.meta.url, context, defaultLoad);
    
    t.equal(format, 'builtin');
    t.end();
});

test('escover: exclude', async (t) => {
    const defaultLoad = stub().returns({
        source: 'const a = 5;',
        format: 'module',
    });
    
    const context = {};
    const {format} = await load(`${__dirname}/node_modules`, context, defaultLoad);
    
    t.equal(format, 'module');
    t.end();
});

test('escover: instrument', async (t) => {
    const defaultLoad = stub().returns({
        source: 'const a = 5;',
        format: 'module',
    });
    
    const context = {};
    const {format} = await load(`${__dirname}/escover.js`, context, defaultLoad);
    
    t.equal(format, 'module');
    t.end();
});

test('escover: exclude: fixture', async (t) => {
    const defaultLoad = stub().returns({
        source: 'const a = 5;',
        format: 'module',
    });
    
    const context = {};
    const {source} = await load(`${__dirname}/fixture/madrun.mjs`, context, defaultLoad);
    
    const expected = 'const a = 5;';
    
    t.equal(source, expected);
    t.end();
});

test('escover: exclude: .madrun.js', async (t) => {
    const defaultLoad = stub().returns({
        source: 'const a = 5;',
        format: 'module',
    });
    
    const context = {};
    const {source} = await load(`${__dirname}/users/.madrun.mjs`, context, defaultLoad);
    
    const expected = 'const a = 5;';
    
    t.equal(source, expected);
    t.end();
});

test('escover: exclude: .spec.mjs', async (t) => {
    const defaultLoad = stub().returns({
        source: 'const a = 5;',
        format: 'module',
    });
    
    const context = {};
    const {source} = await load(`${__dirname}/hello.spec.mjs`, context, defaultLoad);
    
    globalThis.__fileEntries.delete(`file://${__dirname}/hello.spec.mjs`);
    
    const expected = 'const a = 5;';
    
    t.equal(source, expected);
    t.end();
});

test('escover: exclude: test/', async (t) => {
    const defaultLoad = stub().returns({
        source: 'const a = 5;',
        format: 'module',
    });
    
    const context = {};
    const {source} = await load(`${__dirname}/test/hello.mjs`, context, defaultLoad);
    
    const expected = 'const a = 5;';
    
    t.equal(source, expected);
    t.end();
});

test('escover: transform', async (t) => {
    const defaultLoad = stub().returns({
        source: 'const a = 5;',
        format: 'module',
    });
    
    const context = {};
    const url = `${__dirname}/abc/hello.mjs`;
    const {source} = await load(url, context, defaultLoad);
    
    globalThis.__fileEntries.delete(url);
    
    const expected = montag`
        const __c4 = global.__createC4
    `;
    
    t.match(source, expected);
    t.end();
});

test('escover: transform: json', (t) => {
    const defaultLoad = stub().returns({
        source: '{"hello": "world"}',
        format: 'json',
    });
    
    const context = {};
    const {source} = load(`${__dirname}/abc/hello.mjs`, context, defaultLoad);
    
    globalThis.__fileEntries.delete(`${__dirname}/abc/hello.mjs`);
    const expected = montag`
         {"hello": "world"}
    `;
    
    t.match(source, expected);
    t.end();
});

test('escover: transform: buffer', async (t) => {
    const defaultLoad = stub().returns({
        source: Buffer.from('const a = 5;'),
        format: 'module',
    });
    
    const context = {};
    const {source} = await load(`${__dirname}/abc/hello.mjs`, context, defaultLoad);
    
    globalThis.__fileEntries.delete(`${__dirname}/abc/hello.mjs`);
    
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
    
    const context = {};
    const {source} = await load(`/abc/hello.mjs`, context, defaultLoad);
    
    globalThis.__fileEntries.delete(`${__dirname}/abc/hello.mjs`);
    
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
    
    const context = {};
    const {format} = await load(import.meta.url, context, defaultLoad);
    
    t.equal(format, 'commonjs');
    t.end();
});

test('escover: again', async (t) => {
    const defaultLoad = stub().returns({
        source: 'const __c4 = 5;',
        format: 'module',
    });
    
    const context = {};
    const {source} = await load(import.meta.url.replace('.spec', ''), context, defaultLoad);
    
    t.equal(source, 'const __c4 = 5;');
    t.end();
});
