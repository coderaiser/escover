import {createMockImport} from 'mock-import';
import {
    test,
    stub,
} from 'supertape';
import process from 'node:process';
import {isExclude} from './config.js';

const {
    reImport,
    mockImport,
    stopAll,
} = createMockImport(import.meta.url);

const checkNode = () => /v20/.test(process.version);

const skip = (t) => {
    t.pass('skip on node v20');
    t.end();
};

test('escover: config: readConfig', async (t) => {
    if (checkNode())
        return skip(t);
    
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
    const result = isExclude('/test/1.js', ['test']);
    
    t.ok(result, 'should add globs');
    t.end();
});
