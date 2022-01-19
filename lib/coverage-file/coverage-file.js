import {
    writeFileSync,
    readFileSync,
} from 'fs';
import tryCatch from 'try-catch';
import {getFileEntries} from '../c4.js';
import {transform} from '../transform.js';
import {merge} from '../merge.js';
import {findCacheDir} from './find-cache-dir.js';

const {
    stringify,
    parse,
} = JSON;

const NAME = 'escover';
const buildName = (a) => `${a}/${NAME}.json`;

export const write = () => {
    const files = getFileEntries();
    
    if (!files.size)
        return;
    
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
    
    const [error, data] = tryCatch(readFileSync, buildName(name), 'utf8');
    
    if (error)
        return [];
    
    return parse(data);
};

