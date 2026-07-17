import {test, stub} from 'supertape';
import {isExclude, readConfig} from './config.js';

const {stringify} = JSON;

test('escover: config: readConfig', async (t) => {
    const find = stub();
    
    await readConfig({
        find,
    });
    
    t.calledWith(find, ['.nycrc.json']);
    t.end();
});

test('escover: config: isExclude', (t) => {
    const result = isExclude('/test/1.js', ['test']);
    
    t.ok(result, 'should add globs');
    t.end();
});

test('escover: config: readConfig: returns checkCoverage false by default', async (t) => {
    const find = stub();
    const read = stub();
    
    const result = await readConfig({
        find,
        read,
    });
    
    t.notOk(result.checkCoverage);
    t.end();
});

test('escover: config: readConfig: returns lines threshold from nycrc', async (t) => {
    const find = stub().returns('/path/.nycrc.json');
    const read = stub().returns(stringify({
        checkCoverage: true,
        lines: 80,
    }));
    
    const result = await readConfig({
        find,
        read,
    });
    
    t.equal(result.lines, 80);
    t.end();
});

test('escover: config: readConfig: returns checkCoverage true when set in nycrc', async (t) => {
    const find = stub().returns('/path/.nycrc.json');
    const read = stub().returns(stringify({
        checkCoverage: true,
    }));
    
    const result = await readConfig({
        find,
        read,
    });
    
    t.ok(result.checkCoverage);
    t.end();
});

test('escover: config: readConfig: lines defaults to 100', async (t) => {
    const find = stub();
    const read = stub();
    
    const result = await readConfig({
        find,
        read,
    });
    
    t.equal(result.lines, 100);
    t.end();
});
