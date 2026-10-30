import {test} from 'supertape';
import {calculate} from './calculator.js';

test('escover: formatter-responsive: calculate: default columns (80): nothing uncovered: no lines column', (t) => {
    const result = calculate();
    
    const expected = {
        showPercent: true,
        linesColWidth: 0,
        percentColWidth: 7,
        fileColWidth: 64,
    };
    
    t.deepEqual(result, expected);
    t.end();
});

test('escover: formatter-responsive: calculate: lines column fits content', (t) => {
    const result = calculate(80, 30);
    
    const expected = {
        showPercent: true,
        linesColWidth: 30,
        percentColWidth: 7,
        fileColWidth: 31,
    };
    
    t.deepEqual(result, expected);
    t.end();
});

test('escover: formatter-responsive: calculate: small columns hides percent: file gets all the space', (t) => {
    const result = calculate(60);
    
    const expected = {
        showPercent: false,
        linesColWidth: 0,
        percentColWidth: 0,
        fileColWidth: 54,
    };
    
    t.deepEqual(result, expected);
    t.end();
});

test('escover: formatter-responsive: calculate: small columns: lines column fits content', (t) => {
    const result = calculate(60, 12);
    
    const expected = {
        showPercent: false,
        linesColWidth: 12,
        percentColWidth: 0,
        fileColWidth: 39,
    };
    
    t.deepEqual(result, expected);
    t.end();
});

test('escover: formatter-responsive: calculate: lines column is limited by half of the content', (t) => {
    const result = calculate(60, 100);
    
    const expected = {
        showPercent: false,
        linesColWidth: 25,
        percentColWidth: 0,
        fileColWidth: 26,
    };
    
    t.deepEqual(result, expected);
    t.end();
});

test('escover: formatter-responsive: calculate: small columns: minimum lines column width', (t) => {
    const result = calculate(60, 2);
    
    const expected = {
        showPercent: false,
        linesColWidth: 5,
        percentColWidth: 0,
        fileColWidth: 46,
    };
    
    t.deepEqual(result, expected);
    t.end();
});

test('escover: formatter-responsive: calculate: wide columns keep room for the full header', (t) => {
    const result = calculate(120, 3);
    
    const expected = {
        showPercent: true,
        linesColWidth: 18,
        percentColWidth: 7,
        fileColWidth: 83,
    };
    
    t.deepEqual(result, expected);
    t.end();
});

test('escover: formatter-responsive: calculate: boundary at totalWidth 70', (t) => {
    const result = calculate(72);
    
    const expected = {
        showPercent: true,
        linesColWidth: 0,
        percentColWidth: 7,
        fileColWidth: 56,
    };
    
    t.deepEqual(result, expected);
    t.end();
});

test('escover: formatter-responsive: calculate: below boundary hides percent', (t) => {
    const result = calculate(71);
    
    const expected = {
        showPercent: false,
        linesColWidth: 0,
        percentColWidth: 0,
        fileColWidth: 65,
    };
    
    t.deepEqual(result, expected);
    t.end();
});

test('escover: formatter-responsive: calculate: ensures minimum file column width', (t) => {
    const result = calculate(22, 40);
    
    const expected = {
        showPercent: false,
        linesColWidth: 6,
        percentColWidth: 0,
        fileColWidth: 10,
    };
    
    t.deepEqual(result, expected);
    t.end();
});
