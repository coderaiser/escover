import {test} from 'supertape';
import {transform} from './transform.js';

test('escover: transform: sort', (t) => {
    const files = new Map();
    const places = new Map();
    
    places.set('17:18', true);
    
    files.set('hello.js', places);
    files.set('a.js', places);
    
    const result = transform(files);
    
    const expected = [{
        rawName: 'a.js',
        rawLines: {
            17: true,
        },
    }, {
        rawName: 'hello.js',
        rawLines: {
            17: true,
        },
    }];
    
    t.deepEqual(result, expected);
    t.end();
});

