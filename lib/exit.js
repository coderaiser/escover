import once from 'once';
import {write} from './config.js';

export const exit = once(() => {
    write();
});
