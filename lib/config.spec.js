import {createMockImport} from 'mock-import';
import {
    test,
    stub,
} from 'supertape';

const {
    reImport,
    mockImport,
    stopAll,
} = createMockImport(import.meta.url);

test('escover: config', async (t) => {
    const findUpSync = stub();
    mockImport('find-up', {
        findUpSync,
    });
    
    const {readConfig} = await reImport('./config.js');
    await readConfig();
    
    stopAll();
    
    t.calledWith(findUpSync, ['.nycrc.json']);
    t.end();
});

