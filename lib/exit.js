import once from 'once';
import {write} from './coverage-file.js';

export const exit = once(() => {
    write();
});
