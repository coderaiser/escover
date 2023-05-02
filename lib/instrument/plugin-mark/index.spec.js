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

test('escover: instrument: add lines: transform: ternary', ({transform}) => {
    transform('ternary');
});

test('escover: instrument: add lines: transform: arrow', ({transform}) => {
    transform('arrow');
});

test('escover: instrument: add lines: transform: assignment', ({transform}) => {
    transform('assignment');
});

test('escover: instrument: add lines: transform: if', ({transform}) => {
    transform('if');
});

test('escover: instrument: add lines: transform: continue', ({transform}) => {
    transform('continue');
});

test('escover: instrument: add lines: transform: break', ({transform}) => {
    transform('break');
});

test('escover: instrument: add lines: transform: parent-path', ({transform}) => {
    transform('parent-path');
});

test('escover: instrument: mark: transform: call', ({transform}) => {
    transform('call');
});

test('escover: instrument: mark: transform: inc', ({transform}) => {
    transform('inc');
});

test('escover: instrument: mark: transform: named export', ({transform}) => {
    transform('named-export');
});

test('escover: instrument: mark: transform: named export: no report after transform', ({noReportAfterTransform}) => {
    noReportAfterTransform('named-export');
});
