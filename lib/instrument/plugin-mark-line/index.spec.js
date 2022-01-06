import {createTest} from '@putout/test';
import * as markLine from './index.js';

const test = createTest(import.meta.url, {
    'mark-line': markLine,
});

test('c4: instrument: add lines: report', ({report}) => {
    report('mark-line', 'Mark line');
});

test('c4: instrument: add lines: transform', ({transform}) => {
    transform('mark-line');
});

test('c4: instrument: add lines: transform: no-loc', ({transform}) => {
    transform('no-loc');
});

