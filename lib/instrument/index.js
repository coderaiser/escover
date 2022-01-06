import putout, {} from 'putout';

import * as markLine from './plugin-mark-line/index.js';

export const instrument = (url, source) => {
    const __c4 = global.__createC4(url);
    const options = {
        rules: {
            'mark-line': ['on', {
                __c4,
            }],
        },
        plugins: [
            ['mark-line', markLine],
        ],
    };
    
    const {code} = putout(source, options);
    return code;
};

