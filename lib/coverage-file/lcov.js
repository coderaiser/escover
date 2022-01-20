const {entries} = Object;

export const generateLcov = (files) => {
    const result = [];
    
    for (const {name, lines} of files) {
        result.push(`SF:${name}`);
        for (const [line, covered] of entries(lines)) {
            const count = covered ? 1 : 0;
            result.push(`DA:${line},${count}`);
        }
    }
    
    result.push('end_of_record');
    
    return result.join('\n');
};

const isEnd = (a) => a === 'end_of_record';

export const parseLcov = (lcov) => {
    const files = [];
    let currentFile = {};
    let lines = {};
    
    for (const current of lcov.split('\n')) {
        const [cmd, arg] = current.split(':');
        
        if (cmd === 'SF') {
            lines = {};
            currentFile = {
                name: arg,
                lines,
            };
            files.push(currentFile);
            continue;
        }
        
        if (cmd === 'DA') {
            const [line, covered] = arg.split(',');
            lines[line] = Boolean(Number(covered));
            continue;
        }
        
        if (isEnd(cmd))
            break;
    }
    
    return files;
};

