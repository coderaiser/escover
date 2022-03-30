import {test} from 'supertape';
import {readFile} from 'fs/promises';

const {keys} = Object;
const {parse} = JSON;

test('escover: cli: mock-import should be in dependencies, since zenload uses it', async (t) => {
    const packageJsonPath = new URL('../../package.json', import.meta.url).pathname;
    const {dependencies} = parse(await readFile(packageJsonPath, 'utf8'));
    const names = keys(dependencies);
    const result = names.includes('mock-import');
    
    t.ok(result);
    t.end();
});

