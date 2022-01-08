import {createTest} from '@putout/test';
import * as markLine from './index.js';

const test = createTest(import.meta.url, {
    'mark-line': markLine,
});

test('escover: instrument: add lines: report', ({report}) => {
    report('mark-line', 'Mark line');
});

test('escover: instrument: add lines: transform', ({transform}) => {
    transform('mark-line');
});

test('escover: instrument: add lines: transform: no-loc', ({transform}) => {
    transform('no-loc');
});

test('escover: instrument: add lines: transform: new', ({transform}) => {
    transform('new');
});

test('escover: instrument: add lines: transform: logical', ({transform}) => {
    transform('logical');
});

test('escover: instrument: add lines: transform: arrow', ({transform}) => {
    transform('arrow');
});

test('escover: instrument: add lines: transform: assignment', ({transform}) => {
    transform('assignment');
});
