const sort = (a) => new Map(Array.from(a.entries()).sort());

export const transform = (files) => {
    const result = [];
    const sorted = sort(files);
    
    for (const [rawName, places] of sorted.entries()) {
        const rawLines = {};
        
        for (const [place, covered] of places.entries()) {
            const [line] = place.split(':');
            
            rawLines[line] = covered;
        }
        
        result.push({
            rawName,
            rawLines,
        });
    }
    
    return result;
};

