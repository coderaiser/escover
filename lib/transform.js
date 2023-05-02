const sort = (a) => {
    const sorted = Array
        .from(a.entries())
        .sort();
    return new Map(sorted);
};

const isBool = (a) => typeof a === 'boolean';

export const transform = (files) => {
    const result = [];
    const sorted = sort(files);
    
    for (const [rawName, places] of sorted.entries()) {
        const rawLines = mergeLines(places);
        
        result.push({
            rawName,
            rawLines,
        });
    }
    
    return result;
};

function mergeLines(places) {
    const result = {};
    
    for (const [place, covered] of places.entries()) {
        const [line] = place.split(':');
        
        if (isBool(result[line])) {
            result[line] = result[line] && covered;
            continue;
        }
        
        result[line] = covered;
    }
    
    return result;
}
