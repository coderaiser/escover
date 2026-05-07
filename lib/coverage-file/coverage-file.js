import {writeFileSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import {tryCatch} from 'try-catch';
import {getFileEntries} from '../c4.js';
import {transform} from '../transform.js';
import {merge} from '../merge.js';
import {
    createCoverageDirectory,
    getCoverageDirectory,
} from './coverage-directory.js';
import {generateLcov, parseLcov} from './lcov.js';

const LCOV = 'lcov.info';

export const writeCoverage = (overrides = {}) => {
    const {
        write = writeFileSync,
        getFiles = getFileEntries,
        createCovDir = createCoverageDirectory,
    } = overrides;
    
    const files = getFiles();
    
    if (!files.size)
        return;
    
    const parsed = transform(files);
    const merged = merge(parsed);
    const lcov = generateLcov(merged);
    const dir = createCovDir();
    
    write(join(dir, LCOV), lcov);
};

export const readCoverage = (overrides = {}) => {
    const {
        read = readFileSync,
    } = overrides;
    const dir = getCoverageDirectory();
    const [error, data] = tryCatch(read, join(dir, LCOV), 'utf8');
    
    if (error)
        return [];
    
    return parseLcov(data);
};
