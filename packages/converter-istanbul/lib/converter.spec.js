import {test} from 'supertape';
import {fromIstanbul, toIstanbul} from './converter.js';

test('escover: converter-istanbul: fromIstanbul', (t) => {
    const coverageMap = {
        '/path/file.js': {
            statementMap: {
                0: {
                    start: {
                        line: 1,
                    },
                    end: {
                        line: 1,
                    },
                },
            },
            s: {
                0: 1,
            },
        },
    };
    
    const result = fromIstanbul(coverageMap);
    
    const expected = [{
        name: '/path/file.js',
        lines: {
            1: 1,
        },
    }];
    
    t.deepEqual(result, expected);
    t.end();
});

test('escover: converter-istanbul: toIstanbul', (t) => {
    const files = [{
        name: 'file.js',
        lines: {
            1: 1,
        },
    }];
    
    const result = toIstanbul(files);
    
    const expected = {
        'file.js': {
            path: 'file.js',
            statementMap: {
                0: {
                    start: {
                        line: 1,
                        column: 0,
                    },
                    end: {
                        line: 1,
                        column: 999,
                    },
                },
            },
            fnMap: {},
            branchMap: {},
            s: {
                0: 1,
            },
            f: {},
            b: {},
        },
    };
    
    t.deepEqual(result, expected);
    t.end();
});

test('escover: converter-istanbul: fromIstanbul: uncovered line', (t) => {
    const coverageMap = {
        '/path/file.js': {
            statementMap: {
                0: {
                    start: {
                        line: 1,
                    },
                    end: {
                        line: 1,
                    },
                },
            },
            s: {
                0: 0,
            },
        },
    };
    
    const result = fromIstanbul(coverageMap);
    
    const expected = [{
        name: '/path/file.js',
        lines: {
            1: 0,
        },
    }];
    
    t.deepEqual(result, expected);
    t.end();
});
