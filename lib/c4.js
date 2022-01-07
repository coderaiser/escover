import montag from 'montag';
import process from 'process';
import {instrument} from './instrument/index.js';
import {exclude} from './exclude.js';
import {save} from './save.js';
import {createFileEntry} from './report.js';

global.__createC4 = createFileEntry;

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
    
    const source = montag`
        const __c4 = global.__createC4('${url}');
        ${instrument(url, rawSource)}
    `;
    
    console.log(source);
    
    return {
        format,
        source: `${source}\n console.log('🧨', '${url}')`,
    };
}

process.once('exit', save);

