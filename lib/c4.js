export const __fileEntries = new Map();

export const createFileEntry = (url) => {
    const lines = __fileEntries.get(url) || new Map();
    __fileEntries.set(url, lines);
    
    return {
        '🧨': (line, column) => {
            lines.set(`${line}:${column}`, true);
        },
        'init': (line, column) => {
            lines.set(`${line}:${column}`, false);
        },
    };
};

export const getFileEntries = () => __fileEntries;
