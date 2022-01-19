import once from 'once';
import {writeCoverage} from './coverage-file/coverage-file.js';

export const exit = once(() => {
    writeCoverage();
});
