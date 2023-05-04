import {readFileSync} from 'fs';
import {
    join,
    dirname,
} from 'path';
import {fileURLToPath} from 'url';
import {test} from 'supertape';
import {instrument} from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const readFixture = (a) => readFileSync(join(__dirname, 'fixture', `${a}.js`), 'utf8');

test('escover: instrument: generate: logical expression + sequence expression', (t) => {
    const input = readFixture('logical-sequence');
    const expected = readFixture('logical-sequence-fix');
    
    const url = 'file://instrument/fixture.js';
    const c4 = global.__createC4(url);
    const result = instrument(url, input);
    
    c4['🧨'](1, 1);
    
    t.equal(result, expected);
    t.end();
});

test('escover: instrument: generate: optional chaining', (t) => {
    const input = readFixture('optional-chaining');
    const expected = readFixture('optional-chaining-fix');
    
    const url = 'file://instrument/fixture.js';
    const c4 = global.__createC4(url);
    const result = instrument(url, input);
    
    c4['🧨'](1, 1);
    
    t.equal(result, expected);
    t.end();
});
