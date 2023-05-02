const noop = () => {};

global.__fileEntries = global.__fileEntries || new Map();

export const {__fileEntries} = global;
export const createFileEntry = (url) => {
    url = url.replace(/\?.*$/, '');
    let lines = __fileEntries.get(url);
    
    if (lines) {
        return {
            '🧨': set(lines),
            'init': noop,
        };
    }
    
    lines = new Map();
    
    __fileEntries.set(url, lines);
    
    return {
        '🧨': set(lines),
        'init': init(lines),
    };
};

const set = (lines) => (line, column) => {
    lines.set(`${line}:${column}`, true);
};

const init = (lines) => (line, column) => {
    lines.set(`${line}:${column}`, false);
};

export const getFileEntries = () => __fileEntries;
