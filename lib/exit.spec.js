import {dirname} from 'path';
import {fileURLToPath} from 'url';
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

test('escover: exit: once', async (t) => {
    const once = stub().returns(stub);
    mockImport('once', once);
    
    const {exit} = await reImport('./exit.js');
    
    exit();
    
    stopAll();
    
    t.calledWith(once, [stub()]);
    t.end();
});

test('escover: exit: writeCoverage', async (t) => {
    const once = (a) => a;
    const writeCoverage = stub();
    
    mockImport('once', once);
    mockImport('./coverage-file/coverage-file.js', {
        writeCoverage
    });
    
    const {exit} = await reImport('./exit.js');
    
    exit();
    
    stopAll();
    
    t.calledWith(writeCoverage, []);
    t.end();
});

