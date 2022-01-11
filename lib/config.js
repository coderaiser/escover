import {
    writeFileSync,
    readFileSync,
} from 'fs';
import {getFiles} from './c4.js';
import {transform} from './transform.js';
import {merge} from './merge.js';
import findCacheDir from 'find-cache-dir';

const {
    stringify,
    parse,
} = JSON;

const NAME = 'escover';
const buildName = (a) => `${a}/${NAME}.json`;

export const write = () => {
    const files = getFiles();
    const parsed = transform(files);
    const merged = merge(parsed);
    const name = findCacheDir({
        name: NAME,
        create: true,
    });
    
    writeFileSync(buildName(name), stringify(merged, null, 4));
};

export const read = () => {
    const name = findCacheDir({
        name: NAME,
    });
    
    if (!name)
        return null;
    
    const data = readFileSync(buildName(name), 'utf8');
    return parse(data);
};
