import putout from 'putout';
import * as markLine from './plugin-mark-line/index.js';
import declare from './plugin-declare/index.js';

export const instrument = (source) => {
    const options = {
        plugins: [
            ['mark-line', markLine],
            ['declare', declare],
        ],
    };
    
    const {code} = putout(source, options);
    return code;
};

