import {test} from 'supertape';
import {
    getCoverageDirectory,
    createCoverageDirectory,
} from './coverage-directory.js';

test('escover: coverage-file: coverage-directory: getCoverageDirectory', (t) => {
    const result = getCoverageDirectory();
    
    t.ok(result.endsWith('/coverage'));
    t.end();
});

test('escover: coverage-file: coverage-directory: createCoverageDirectory', (t) => {
    const result = createCoverageDirectory();
    
    t.ok(result.endsWith('/coverage'));
    t.end();
});
