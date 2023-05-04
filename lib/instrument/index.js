import {transform} from 'putout';
import {parse} from '@babel/parser';
import {print} from '@putout/printer';
import * as mark from './plugin-mark/index.js';
import convertOptionalToLogical from '@putout/plugin-convert-optional-to-logical';

export const instrument = (url, source) => {
    const c4 = global.__createC4(url);
    
    const options = {
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
    };
    
    const ast = parse(source);
    
    transform(ast, source, options);
    
    return print(ast);
};

