const files = new Map();

export const createFileEntry = (url) => {
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

export const getFiles = () => files;
