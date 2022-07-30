import process from 'process';

import {instrument} from './instrument/index.js';
import {exit} from './exit.js';
import {createFileEntry} from './c4.js';
import {
    readConfig,
    isExclude,
} from './config.js';

global.__createC4 = createFileEntry;

process.once('exit', exit);
const CWD = process.cwd();

const {exclude} = readConfig();

const EXCLUDE = [
    '**/*.spec.*',
    '**/node_modules/**',
    '**/fixture/**',
    '**/.madrun.*',
    '**/test/**',
    ...exclude,
];

export async function load(url, context, defaultLoad) {
    const {format, source: rawSource} = await defaultLoad(url, context, defaultLoad);
    
    if (/commonjs|builtin/.test(format))
        return {
            format,
        };
    
    if (!url.includes(CWD))
        return {
            format,
            source: rawSource,
        };
    
    if (isExclude(url, EXCLUDE))
        return {
            format,
            source: rawSource,
        };
    
    if (rawSource.includes('const __c4'))
        return {
            format,
            source: rawSource,
        };
    
    const source = `
        const __c4 = global.__createC4('${url}');
        ${instrument(url, rawSource)}
    `;
    
    return {
        format,
        source,
    };
}
