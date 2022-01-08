import {
    test,
    stub,
} from 'supertape';
import {load} from './escover.js';

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

