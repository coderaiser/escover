import putout from 'putout';
import * as markLine from './plugin-mark-line/index.js';

export const instrument = (source) => {
    const options = {
        plugins: [
            ['mark-line', markLine],
        ],
    };
    
    const {code} = putout(source, options);
    return code;
};

