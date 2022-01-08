export const parse = (files) => {
    const result = [];
    
    for (const [rawName, places] of files.entries()) {
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
