import {test} from 'supertape';
import {calculate} from './calculator.js';

test('escover: formatter-responsive: calculate: default columns (80)', (t) => {
    const result = calculate();
    
    const expected = {
        showPercent: true,
        linesColWidth: 39,
        percentColWidth: 7,
        fileColWidth: 22,
    };
    
    t.deepEqual(result, expected);
    t.end();
});

test('escover: formatter-responsive: calculate: small columns hides percent', (t) => {
    const result = calculate(60);
    
    const expected = {
        showPercent: false,
        linesColWidth: 29,
        percentColWidth: 0,
        fileColWidth: 19,
    };
    
    t.deepEqual(result, expected);
    t.end();
});

test('escover: formatter-responsive: calculate: boundary at totalWidth 70', (t) => {
    const result = calculate(72);
    
    const expected = {
        showPercent: true,
        linesColWidth: 35,
        percentColWidth: 7,
        fileColWidth: 18,
    };
    
    t.deepEqual(result, expected);
    t.end();
});

test('escover: formatter-responsive: calculate: below boundary hides percent', (t) => {
    const result = calculate(71);
    
    const expected = {
        showPercent: false,
        linesColWidth: 34,
        percentColWidth: 0,
        fileColWidth: 25,
    };
    
    t.deepEqual(result, expected);
    t.end();
});

test('escover: formatter-responsive: calculate: ensures minimum file column width', (t) => {
    const result = calculate(22);
    
    const expected = {
        showPercent: false,
        linesColWidth: 10,
        percentColWidth: 0,
        fileColWidth: 10,
    };
    
    t.deepEqual(result, expected);
    t.end();
});
