import process from 'node:process';
import {montag} from 'montag';
import {instrument} from './instrument/index.js';
import {createFileEntry} from './c4.js';
import {readConfig, isExclude} from './config.js';

globalThis.__createC4 = createFileEntry;

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

export function load(url, context, defaultLoad) {
    const result = defaultLoad(url, context, defaultLoad);
    const {format, source: rawSource} = result;
    
    if (!url.includes(CWD))
        return result;
    
    if (/json|commonjs|builtin/.test(format))
        return result;
    
    if (isExclude(url, EXCLUDE))
        return result;
    
    if (rawSource.includes('const __c4'))
        return result;
    
    const source = montag`
        const __c4 = global.__createC4('${url}');
        ${instrument(url, String(rawSource))}
    `;
    
    return {
        format,
        source,
        shortCircuit: true,
    };
}
