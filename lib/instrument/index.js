import {
    parse,
    generate,
    transform,
} from 'putout';
import * as mark from './plugin-mark/index.js';

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
        ],
    };
    
    const ast = parse(source);
    
    transform(ast, source, options);
    const {code} = generate(ast);
    
    return code;
};

