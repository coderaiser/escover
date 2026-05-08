export function groupByFolder(files) {
    const groups = new Map();
    
    for (const f of files) {
        const parts = f.filename.split('/');
        const folder = parts.length > 1 ? parts
            .slice(0, -1)
            .join('/') : '';
        
        const fileName = parts.at(-1);
        
        let group = groups.get(folder);
        
        if (!group) {
            group = {
                files: [],
            };
            groups.set(folder, group);
        }
        
        group.files.push({
            ...f,
            shortName: fileName,
        });
    }
    
    return groups;
}

