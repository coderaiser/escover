import process from 'node:process';
import {
    table,
    getBorderCharacters,
} from 'table';
import {buildGroupedTable} from './build-grouped-table.js';
import {calculate} from './calculator.js';

const {cwd, stdout} = process;
const CWD = cwd();
const {entries, keys} = Object;

export default (coverageFile, overrides = {}) => {
    const {
        skipFull = false,
        columns = stdout.columns,
    } = overrides;
    
    const files = parseCoverageFile(coverageFile, skipFull);
    
    if (skipFull && !files.length)
        return '💪 coverage 100%, good job!\n';
    
    const {
        showPercent,
        linesColWidth,
        percentColWidth,
        fileColWidth,
    } = calculate(columns);
    
    const tableData = buildGroupedTable({
        files,
        showPercent,
        linesColWidth,
        fileColWidth,
    });
    
    const options = createTableOptions({
        showPercent,
        tableData,
        fileColWidth,
        percentColWidth,
        linesColWidth,
    });
    
    return table(tableData, options);
};

export function createTableOptions({showPercent, tableData, fileColWidth, percentColWidth, linesColWidth}) {
    const columns = [{
        paddingLeft: 1,
        paddingRight: 1,
        width: fileColWidth,
        wrapWord: false,
    }];
    
    if (showPercent)
        columns.push({
            alignment: 'center',
            paddingLeft: 1,
            paddingRight: 1,
            width: percentColWidth,
        });
    
    columns.push({
        paddingLeft: 1,
        paddingRight: 1,
        width: linesColWidth,
        wrapWord: false,
    });
    
    return {
        drawHorizontalLine: (i) => !i || i === 1 || i === tableData.length,
        columns,
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
    };
}

export function parseCoverageFile(coverageFile, skipFull) {
    const files = [];
    
    for (const {name, lines} of coverageFile) {
        const uncovered = parseUncoveredLines(lines);
        const linesCount = keys(lines).length;
        const uncoveredLinesCount = uncovered.length;
        const percentLines = getLinesPercent(linesCount, uncoveredLinesCount);
        const covered = uncoveredLinesCount === 0;
        
        if (skipFull && covered)
            continue;
        
        files.push({
            filename: name.replace(`${CWD}/`, ''),
            covered,
            lines: uncovered,
            percentLines,
        });
    }
    
    return files;
}

export function parseUncoveredLines(lines) {
    const out = [];
    
    for (const [line, covered] of entries(lines))
        if (!covered)
            out.push(Number(line));
    
    return out;
}

export function getLinesPercent(linesCount, uncoveredLinesCount) {
    if (!linesCount)
        return 100;
    
    const ratio = 100 / linesCount * uncoveredLinesCount;
    
    return 100 - Math.round(ratio);
}
