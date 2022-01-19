const {entries} = Object;

export const createLcov = (files) => {
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
