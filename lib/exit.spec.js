import {createMockImport} from 'mock-import';
import {test, stub} from 'supertape';

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
    
    t.calledWith(once, [
        stub(),
    ]);
    t.end();
});

test('escover: exit: writeCoverage', async (t) => {
    const once = (a) => a;
    const writeCoverage = stub();
    
    mockImport('once', once);
    mockImport('./coverage-file/coverage-file.js', {
        writeCoverage,
    });
    
    const {exit} = await reImport('./exit.js');
    
    exit();
    stopAll();
    
    t.calledWithNoArgs(writeCoverage);
    t.end();
});
