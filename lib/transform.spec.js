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

test('escover: transform: not full covered', (t) => {
    const files = new Map();
    
    const helloPlaces = new Map();
    helloPlaces.set('17:18', true);
    helloPlaces.set('17:19', false);
    
    const worldPlaces = new Map();
    worldPlaces.set('17:18', false);
    worldPlaces.set('17:19', true);
    
    files.set('hello.js', helloPlaces);
    files.set('world.js', worldPlaces);
    
    const result = transform(files);
    
    const expected = [{
        rawName: 'hello.js',
        rawLines: {
            17: false,
        },
    }, {
        rawName: 'world.js',
        rawLines: {
            17: false,
        },
    }];
    
    t.deepEqual(result, expected);
    t.end();
});

test('escover: transform: not full covered: middle', (t) => {
    const files = new Map();
    
    const helloPlaces = new Map();
    helloPlaces.set('17:18', true);
    helloPlaces.set('17:19', false);
    helloPlaces.set('17:20', true);
    
    files.set('hello.js', helloPlaces);
    
    const result = transform(files);
    
    const expected = [{
        rawName: 'hello.js',
        rawLines: {
            17: false,
        },
    }];
    
    t.deepEqual(result, expected);
    t.end();
});
