import {
    table,
    getBorderCharacters,
} from 'table';

import chalk from 'chalk';

const CWD = process.cwd();
const {
    entries,
    keys,
} = Object;

export default (coverageFile) => {
    const files = parseCoverageFile(coverageFile);
    
    const tableData = [
        ['File', '% Lines', 'Uncovered Lines #s'],
    ];
    
    for (const {filename, covered, lines, percentLines} of files) {
        const uncoveredLines = lines.join(', ');
        
        if (covered) {
            tableData.push([chalk.green(filename), chalk.green(percentLines), '']);
            continue;
        }
        
        tableData.push([chalk.red(filename), chalk.red(percentLines), chalk.red(uncoveredLines)]);
    }
    
    return table(tableData, {
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
    });
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
        
        const linesCount = keys(lines).length;
        const percentLines = getPercentLines(linesCount, uncoveredLines);
        
        files.push({
            filename,
            covered: !uncoveredLines.length,
            lines: uncoveredLines,
            percentLines,
        });
    }
    
    return files;
}

function getPercentLines(linesCount, uncoveredLines) {
    if (!linesCount)
        return 100;
    
    return 100 - Math.round(100 / linesCount * uncoveredLines.length);
}
