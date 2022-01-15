import putout, {} from 'putout';

import * as mark from './plugin-mark/index.js';

export const instrument = (url, source) => {
    const c4 = global.__createC4(url);
    const options = {
        rules: {
            mark: ['on', {
                c4,
            }],
        },
        plugins: [
            ['mark', mark],
        ],
    };
    
    const {code} = putout(source, options);
    return code;
};

