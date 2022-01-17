import chalk from 'chalk';
const {entries} = Object;

export default (coverageFile) => {
    const files = [];
    const coverage = {
        files,
        coveredCount: 0,
        uncoveredCount: 0,
    };
    
    console.log('# CAP version 13');
    console.log('');
    
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
            console.log(`# ${name}`);
            console.log('🧨 should be covered');
            console.log('---');
            console.log(`lines:`);
            for (const line of uncoveredLines) {
                console.log(`️- ${chalk.red(line)} at file://${name}:${line}`);
            }
            console.log('');
        }
    }
    
    console.log(`1..${files.length}`);
    console.log(`# files: ${files.length}`);
    console.log(`# covered: ${coverage.coveredCount}`);
    
    console.log('');
    
    if (!coverage.uncoveredCount) {
        console.log('#️ 🌴 ok');
    }
    
    if (coverage.uncoveredCount) {
        console.log(`# 🧨 fail: ${coverage.uncoveredCount}`);
    }
    
    console.log('');
};

