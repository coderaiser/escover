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

test('escover: converter-istanbul: fromIstanbul: with CoverageMap class', async (t) => {
    const libCoverage = await import('istanbul-lib-coverage');
    const map = libCoverage.default.createCoverageMap();
    
    map.addFileCoverage({
        path: '/path/file.js',
        statementMap: {
            '0': {
                start: {line: 1, column: 0},
                end: {line: 1, column: 10},
            },
            '1': {
                start: {line: 3, column: 0},
                end: {line: 3, column: 10},
            },
        },
        fnMap: {},
        branchMap: {},
        s: {'0': 1, '1': 0},
        f: {},
        b: {},
    });
    
    const result = fromIstanbul(map);
    
    const expected = [{
        name: '/path/file.js',
        lines: {
            1: 1,
            3: 0,
        },
    }];
    
    t.deepEqual(result, expected);
    t.end();
});
