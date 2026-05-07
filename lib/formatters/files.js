import process from 'node:process';
import {
    table,
    getBorderCharacters,
} from 'table';
import chalk from 'chalk';

const CWD = process.cwd();

const {entries, keys} = Object;

export default (coverageFile) => {
    const files = parseCoverageFile(coverageFile);
    
    const tableData = [
        ['File', '% Lines', 'Uncovered Lines #s'],
    ];
    
    for (const {filename, covered, lines, percentLines} of files) {
        const uncoveredLines = formatLines(lines);
        
        const color = (value) => colorize(percentLines, value);
        
        tableData.push([
            color(filename),
            color(percentLines),
            covered ? '' : color(uncoveredLines),
        ]);
    }
    
    return table(tableData, {
        drawHorizontalLine: (raw) => {
            return !raw || raw === 1 || raw === files.length + 1;
        },
        columns: [{
            paddingLeft: 0,
        }, {
            alignment: 'center',
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

function colorize(percent, value) {
    if (percent === 100)
        return chalk.hex('#4caf50')(value);
    
    /*
    if (percent >= 50)
        return chalk.hex('#ffb300')(value);
        */
    return chalk.hex('#f44336')(value);
}

export function formatLines(array) {
    const lines = array
        .slice(0, 10)
        .join(', ');
    
    if (array.length <= 10)
        return lines;
    
    const latest = array.at(-1);
    
    return `${lines}..${latest}`;
}

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
        const filename = name.replace(`${CWD}/`, '');
        const uncoveredLines = parseUncoveredLines(lines);
        
        const linesCount = keys(lines).length;
        const uncoveredLinesCount = uncoveredLines.length;
        
        const percentLines = getLinesPercent(linesCount, uncoveredLinesCount);
        
        files.push({
            filename,
            covered: !uncoveredLinesCount,
            lines: uncoveredLines,
            percentLines,
        });
    }
    
    return files;
}

export function getLinesPercent(linesCount, uncoveredLinesCount) {
    if (!linesCount)
        return 100;
    
    return 100 - Math.round(100 / linesCount * uncoveredLinesCount);
}
