import once from 'once';

import {save} from './save.js';
import {report} from './report.js';

export const exit = once(() => {
    save();
    report();
});
