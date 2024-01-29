import {
    writeFileSync,
    readFileSync,
} from 'node:fs';
import {join} from 'node:path';

import tryCatch from 'try-catch';

import {getFileEntries} from '../c4.js';
import {transform} from '../transform.js';
import {merge} from '../merge.js';
import {findCacheDir} from './find-cache-dir.js';
import {
    generateLcov,
    parseLcov,
} from './lcov.js';

const LCOV = 'lcov.info';

export const writeCoverage = () => {
    const files = getFileEntries();
    
    if (!files.size)
        return;
    
    const parsed = transform(files);
    const merged = merge(parsed);
    const lcov = generateLcov(merged);
    const dir = findCacheDir();
    
    writeFileSync(join(dir, LCOV), lcov);
};

export const readCoverage = () => {
    const dir = findCacheDir();
    const [error, data] = tryCatch(readFileSync, join(dir, LCOV), 'utf8');
    
    if (error)
        return [];
    
    return parseLcov(data);
};
