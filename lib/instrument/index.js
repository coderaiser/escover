
import putout from 'putout';
import addLines from './plugin-add-lines/index.js';

export const instrument = ({source}) => {
    const options = {
        plugins: [
            ['add-lines', addLines],
        ],
    };
    
    const {code} = putout(source, options);
    return code;
};

