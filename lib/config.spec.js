import {test, stub} from 'supertape';
import {isExclude, readConfig} from './config.js';

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
