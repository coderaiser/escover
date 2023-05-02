import {test} from 'supertape';
import {merge} from './merge.js';

test('escover: merge', (t) => {
    const files = [{
        rawName: 'file:///changelog.js?mock-import-count=1',
        rawLines: {
            8: true,
            11: false,
            13: false,
        },
    }, {
        rawName: 'file:///changelog.js?mock-import-count=1',
        rawLines: {
            8: false,
            11: true,
            13: false,
        },
    }, {
        rawName: 'file:///changelog.js?mock-import-count=1',
        rawLines: {
            8: false,
            11: false,
            13: true,
        },
    }];
    
    const result = merge(files);
    
    const expected = [{
        name: '/changelog.js',
        lines: {
            8: true,
            11: true,
            13: true,
        },
    }];
    
    t.deepEqual(result, expected);
    t.end();
});
