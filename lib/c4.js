import process from 'process';
import {instrument} from './instrument/index.js';
import {exclude} from './exclude.js';

const files = new Map();

global.__createC4 = (url) => {
    const lines = files.get(url) || new Map();
    files.set(url, lines);
    
    return {
        mark: (line, column) => {
            lines.set(`${line}:${column}`, true);
        },
        init: (line, column) => {
            lines.set(`${line}:${column}`, false);
        },
    };
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
    
    const source = `const __c4 = global.__createC4('${url}');\n\n${instrument(url, rawSource)}`;
    console.log('->', source);
    
    return {
        format,
        source: `${source}\n console.log('🧨', '${url}')`,
    };
}

process.on('exit', () => {
    console.log(files);
});
