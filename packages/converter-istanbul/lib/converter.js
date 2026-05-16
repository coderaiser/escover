import path from 'node:path';
import process from 'node:process';

const {entries} = Object;

export function fromIstanbul(coverageMap) {
    const result = [];
    const {data} = coverageMap;
    
    for (const [name, file] of entries(data)) {
        const lines = {};
        
        for (const [id, count] of entries(file.s)) {
            const stmt = file.statementMap[id];
            
            for (let {line} = stmt.start; line <= stmt.end.line; line++)
                lines[line] ||= count > 0 ? 1 : 0;
        }
        
        result.push({
            name,
            lines,
        });
    }
    
    return result;
}

export function toIstanbul(files) {
    const out = {};
    
    for (const file of files) {
        const statementMap = {};
        const s = {};
        
        let i = 0;
        
        for (const [line, covered] of entries(file.lines)) {
            statementMap[i] = {
                start: {
                    line: Number(line),
                    column: 0,
                },
                end: {
                    line: Number(line),
                    column: 999,
                },
            };
            
            s[i] = covered;
            i++;
        }
        
        const relativePath = path.relative(process.cwd(), file.name);
        
        out[relativePath] = {
            path: relativePath,
            statementMap,
            fnMap: {},
            branchMap: {},
            s,
            f: {},
            b: {},
        };
    }
    
    return out;
}

