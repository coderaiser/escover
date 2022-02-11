import {test} from 'supertape';

test('escover: exports: plugin', async (t) => {
    const exported = await import('escover/plugin');
    const plugin = await import('../lib/instrument/plugin-mark/index.js');
    
    t.equal(exported, plugin);
    t.end();
});

test('escover: exports: instrument', async (t) => {
    const exported = await import('escover');
    const {instrument} = await import('../lib/instrument/index.js');
    
    t.equal(exported.default, instrument);
    t.end();
});

test('escover: exports: loader', async (t) => {
    const {loader: exportedLoader} = await import('escover');
    const {loader} = await import('../lib/escover.js');
    
    t.equal(exportedLoader, loader);
    t.end();
});
