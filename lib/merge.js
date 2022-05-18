const {entries} = Object;

export const merge = (files) => {
    const deduplicator = {};
    
    for (const {rawName, rawLines} of files) {
        const name = cutQuery(rawName);
        
        deduplicator[name] = applyCoverage({
            name,
            rawLines,
            deduplicator,
        });
    }
    
    const list = [];
    
    for (const [name, lines] of entries(deduplicator)) {
        list.push({
            name,
            lines,
        });
    }
    
    return list;
};

function applyCoverage({rawLines, name, deduplicator}) {
    if (!deduplicator[name])
        return rawLines;
    
    const newLines = {};
    
    for (const [line, value] of entries(rawLines))
        newLines[line] = deduplicator[name][line] || value;
    
    return newLines;
}

function cutQuery(name) {
    return name
        .replace('file://', '')
        .replace(/\?.*/, '');
}
