import putout from 'putout';
import * as mark from './plugin-mark/index.js';
import convertOptionalToLogical from '@putout/plugin-convert-optional-to-logical';

export const instrument = (url, source) => {
    const c4 = global.__createC4(url);
    
    const {code} = putout(source, {
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
    
    return code;
};

