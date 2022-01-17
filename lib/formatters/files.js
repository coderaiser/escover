import {
    table,
    getBorderCharacters,
} from 'table';

import chalk from 'chalk';

const CWD = process.cwd();
const {entries} = Object;

export default (coverageFile) => {
    const files = parseCoverageFile(coverageFile);
    const tableData = [
        ['File', 'Uncovered Lines'],
    ];
    
    for (const {filename, covered, lines} of files) {
        const uncoveredLines = lines.join(', ');
        
        if (covered) {
            tableData.push([chalk.green(filename), '']);
            continue;
        }
        
        tableData.push([chalk.red(filename), chalk.red(uncoveredLines)]);
    }
    
    console.log(table(tableData, {
        drawHorizontalLine: (raw) => {
            return !raw || raw === 1 || raw === files.length + 1;
        },
        columns: [{
            paddingLeft: 0,
        }],
        border: {
            ...getBorderCharacters('void'),
            topBody: '-',
            bottomBody: '-',
            joinBody: '-',
            topJoin: '|',
            bottomJoin: '|',
            joinJoin: '|',
            bodyJoin: '|',
        },
    }));
};

function parseUncoveredLines(lines) {
    const uncoveredLines = [];
    
    for (const [line, covered] of entries(lines)) {
        if (covered)
            continue;
        
        uncoveredLines.push(line);
    }
    
    return uncoveredLines;
}

function parseCoverageFile(coverageFile) {
    const files = [];
    for (const {name, lines} of coverageFile) {
        const filename = name.replace(CWD + '/', '');
        const uncoveredLines = parseUncoveredLines(lines);
        
        files.push({
            filename,
            covered: !uncoveredLines.length,
            lines: parseUncoveredLines(lines),
        });
    }
    
    return files;
}

