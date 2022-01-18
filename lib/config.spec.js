import {createMockImport} from 'mock-import';
import {
    test,
    stub,
} from 'supertape';
import {isExclude} from './config.js';

const {
    reImport,
    mockImport,
    stopAll,
} = createMockImport(import.meta.url);

test('escover: config: readConfig', async (t) => {
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

test('escover: config: isExclude', (t) => {
    const result = isExclude('/test/1.js', [
        'test',
    ]);
    
    t.ok(result, 'should add globs');
    t.end();
});

