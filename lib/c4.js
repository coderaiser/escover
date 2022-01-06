import process from 'process';
import {instrument} from './instrument/index.js';

export async function load(url, context, defaultLoad) {
    const {format, source: rawSource} = await defaultLoad(url, context, defaultLoad);
    
    if (format === 'commonjs')
        return {
            format,
        };
    
    const source = instrument(rawSource);
    
    return {
        format,
        source: `${source}\n console.log('🧨', '${url}')`,
    };
}

process.on('exit', () => {});
