import putout from 'putout';
import * as convertOptionalToLogical from '@putout/plugin-convert-optional-to-logical';
import {tryCatch} from 'try-catch';
import * as mark from './plugin-mark/index.js';

const {assign} = Object;

export const instrument = (url, source) => {
    const c4 = globalThis.__createC4(url);
    
    const [error, result] = tryCatch(putout, source, {
        printer: 'putout',
        fixCount: 1,
        rules: {
            mark: ['on', {
                c4,
            }],
        },
        plugins: [
            ['mark', mark],
            ['convert-optional-to-logical', convertOptionalToLogical],
        ],
    });
    
    if (error) {
        assign(error, {
            message: `${url}: ${error.message}`,
        });
        throw error;
    }
    
    const {code} = result;
    
    return code;
};
