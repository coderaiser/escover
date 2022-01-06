import process from 'process';
import {instrument} from './instrument/index.js';
import {exclude} from './exclude.js';

global.__c4 = {
    lines: new Map(),
};

global.__c4.mark = ({line, column}) => {
    global.__c4.lines.set(`${line}:${column}`, true);
};

export async function load(url, context, defaultLoad) {
    const {format, source: rawSource} = await defaultLoad(url, context, defaultLoad);
    
    if (/commonjs|builtin/.test(format))
        return {
            format,
        };
    
    if (exclude(url, ['.spec.js', 'node_modules']))
        return {
            format,
            source: rawSource,
        };
    
    const source = instrument(rawSource);
    
    return {
        format,
        source: `${source}\n console.log('🧨', '${url}')`,
    };
}

process.on('exit', () => {

});
