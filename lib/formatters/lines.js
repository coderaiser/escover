import chalk from 'chalk';
const {entries} = Object;

const createOut = (output) => (a) => output.push(a);
export default (coverageFile) => {
    const output = [];
    const out = createOut(output);
    const files = [];
    const coverage = {
        files,
        coveredCount: 0,
        uncoveredCount: 0,
    };
    
    out('# CAP version 13');
    out('');
    
    for (const {name, lines} of coverageFile) {
        const uncoveredLines = [];
        
        for (const [line, covered] of entries(lines)) {
            if (covered)
                continue;
            
            uncoveredLines.push(line);
        }
        
        const file = {
            name,
            covered: !uncoveredLines.length,
            uncoveredLines,
        };
        
        if (file.covered)
            ++coverage.coveredCount;
        
        if (!file.covered)
            ++coverage.uncoveredCount;
        
        files.push(file);
    }
    
    for (const {name, covered, uncoveredLines} of files) {
        if (!covered) {
            out(`# ${name}`);
            out('🧨 should be covered');
            out('---');
            out(`lines:`);
            for (const line of uncoveredLines) {
                out(`️- ${chalk.red(line)} at file://${name}:${line}`);
            }
            out('');
        }
    }
    
    out(`1..${files.length}`);
    out(`# files: ${files.length}`);
    out(`# covered: ${coverage.coveredCount}`);
    out('');
    
    if (!coverage.uncoveredCount)
        out('#️ 🌴 ok');
    
    if (coverage.uncoveredCount)
        out(`# 🧨 fail: ${coverage.uncoveredCount}`);
    
    out('');
    
    return output.join('\n');
};
