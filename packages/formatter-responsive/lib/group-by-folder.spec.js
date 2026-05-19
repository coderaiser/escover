import {test} from 'supertape';
import {groupByFolder} from './group-by-folder.js';

test('groupByFolder: groups files by folder', (t) => {
    const result = groupByFolder([{
        filename: 'a/one.js',
    }, {
        filename: 'a/two.js',
    }]);
    
    const group = result.get('a');
    
    t.equal(group.files.length, 2);
    t.end();
});

test('groupByFolder: keeps fileName as last segment', (t) => {
    const result = groupByFolder([{
        filename: 'a/one.js',
    }]);
    
    const group = result.get('a');
    
    t.equal(group.files[0].fileName, 'one.js');
    t.end();
});

test('groupByFolder: root files have empty folder', (t) => {
    const result = groupByFolder([{
        filename: 'index.js',
    }]);
    
    const group = result.get('');
    
    t.equal(group.files[0].fileName, 'index.js');
    t.end();
});

test('groupByFolder: preserves full filename in original object', (t) => {
    const result = groupByFolder([{
        filename: 'lib/utils/a.js',
    }]);
    
    const group = result.get('lib/utils');
    
    t.equal(group.files[0].filename, 'lib/utils/a.js');
    t.end();
});

test('groupByFolder: multiple folders are separated', (t) => {
    const result = groupByFolder([{
        filename: 'a/one.js',
    }, {
        filename: 'b/two.js',
    }]);
    
    t.equal(result.size, 2);
    t.end();
});

test('groupByFolder: deep folder structure is preserved', (t) => {
    const result = groupByFolder([{
        filename: 'lib/utils/deep/file.js',
    }]);
    
    const group = result.get('lib/utils/deep');
    
    t.equal(group.files[0].fileName, 'file.js');
    t.end();
});

test('groupByFolder: multiple deep files stay in same group', (t) => {
    const result = groupByFolder([{
        filename: 'lib/utils/a.js',
    }, {
        filename: 'lib/utils/b.js',
    }]);
    
    const group = result.get('lib/utils');
    
    t.equal(group.files.length, 2);
    t.end();
});

test('groupByFolder: empty input returns empty map', (t) => {
    const result = groupByFolder([]);
    
    t.equal(result.size, 0);
    t.end();
});

test('groupByFolder: handles single file: count', (t) => {
    const result = groupByFolder([{
        filename: 'only.js',
    }]);
    
    t.equal(result.size, 1);
    t.end();
});

test('groupByFolder: handles single file', (t) => {
    const result = groupByFolder([{
        filename: 'only.js',
    }]);
    
    const group = result.get('');
    
    t.equal(group.files[0].fileName, 'only.js');
    t.end();
});

test('groupByFolder: handles single file: nested', (t) => {
    const result = groupByFolder([{
        filename: 'lib/apply-types/index.js',
    }]);
    
    const group = result.get('lib/apply-types');
    
    t.equal(group.files[0].fileName, 'index.js');
    t.end();
});
