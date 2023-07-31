import process from 'process';
import montag from 'montag';
import {instrument} from './instrument/index.js';
import {createFileEntry} from './c4.js';
import {
    readConfig,
    isExclude,
} from './config.js';
import {writeCoverage} from './coverage-file/coverage-file.js';

global.__createC4 = createFileEntry;

const port = {};
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

export function globalPreload({port}) {
    port.onmessage = ({data}) => {
        const {
            type,
            url,
            line,
            column,
            loader,
        } = data;
        
        if (loader !== 'escover')
            return;
        
        const c4 = createFileEntry(url);
        
        if (type === 'set')
            c4['🧨'](line, column);
        
        if (type === 'init')
            c4.init(line, column);
        
        writeCoverage();
    };
    
    return `(${escover})();`;
}

function escover() {
    const loader = 'escover';
    
    global.__createC4 = (url) => ({
        '🧨': (line, column) => {
            port.postMessage({
                type: 'set',
                url,
                line,
                column,
                loader,
            });
        },
        'init': (line, column) => {
            port.postMessage({
                type: 'init',
                url,
                line,
                column,
                loader,
            });
        },
    });
}

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
    
    const source = montag`
        const __c4 = global.__createC4('${url}');
        ${instrument(url, String(rawSource))}
    `;
    
    return {
        format,
        source,
    };
}

