import once from 'once';
import {write} from './coverage.js';

export const exit = once(() => {
    write();
});
