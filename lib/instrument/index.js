import putout from 'putout';
import * as mark from './plugin-mark/index.js';
import * as convertOptionalToLogical from '@putout/plugin-convert-optional-to-logical';

const cut = (a) => a.replace('#!/usr/bin/env node', '');

export const instrument = (url, source) => {
    const c4 = global.__createC4(url);
    
    source = cut(source);
    
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
