import process from 'node:process';
import {
    table,
    getBorderCharacters,
} from 'table';
import chalk from 'chalk';

const isNumber = (a) => !Number.isNaN(a) && typeof a === 'number';
const CWD = process.cwd();
const {entries, keys} = Object;

const makeGreen = chalk.hex('#4caf50');
const makeRed = chalk.hex('#f44336');

export default (coverageFile, {skipFull = false} = {}) => {
    const files = parseCoverageFile(coverageFile, skipFull);
    
    if (skipFull && !files.length)
        return '💪 coverage 100% Good Job!\n';
    
    const totalWidth = process.stdout.columns || 80;
    const showPercent = totalWidth >= 70;
    
    const linesColWidth = 20;
    const percentColWidth = showPercent ? 7 : 0;
    
    // резерв на бордеры и padding + дополнительный запас
    const fileColWidth = Math.max(10, totalWidth - linesColWidth - percentColWidth - 6 - 4);
    
    const tableData = buildGroupedTable(files, showPercent, linesColWidth);
    
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

export const getColor = (value) => value === 100 ? makeGreen : makeRed;

export function buildGroupedTable(files, showPercent, linesColWidth) {
    const tableData = [];
    
    if (showPercent)
        tableData.push([
            'File',
            '% Lines',
            'Uncovered Lines #s',
        ]);
    else
        tableData.push([
            'File',
            'Uncovered Lines #s',
        ]);
    
    const groups = groupByFolder(files);
    const hideFolders = groups.size === 1;
    
    for (const [folder, group] of groups) {
        let sum = 0;
        
        for (const f of group.files)
            sum += f.percentLines;
        
        const coverage = Math.round(sum / group.files.length);
        
        if (!hideFolders) {
            const row = [];
            row.push(getColor(coverage)(folder));
            
            if (showPercent)
                row.push(getColor(coverage)(`${coverage}%`));
            
            row.push('');
            tableData.push(row);
        }
        
        for (const f of group.files) {
            const row = [];
            row.push(f.covered ? makeGreen(' ' + f.shortName) : makeRed(' ' + f.shortName));
            
            if (showPercent)
                row.push(f.percentLines === 100 ? makeGreen(`${f.percentLines}%`) : makeRed(`${f.percentLines}%`));
            
            row.push(f.covered ? '' : makeRed(formatLines(
                f.lines,
                linesColWidth,
            )));
            tableData.push(row);
        }
    }
    
    return tableData;
}

export function formatLines(array, maxLen = 20) {
    if (array.every(isNumber)) {
        const nums = array
            .slice()
            .sort((a, b) => a - b);
        
        const ranges = [];
        let [start] = nums;
        let [prev] = nums;
        
        for (let i = 1; i < nums.length; i++) {
            const n = nums[i];
            
            if (n === prev + 1) {
                prev = n;
            } else {
                ranges.push(start === prev ? String(start) : `${start}..${prev}`);
                start = n;
                prev = n;
            }
        }
        
        ranges.push(start === prev ? String(start) : `${start}..${prev}`);
        
        const joined = ranges.join(', ');
        
        if (joined.length <= maxLen)
            return joined;
        
        return ranges[0];
    }
    
    // если элементы строки — просто объединяем через ', ' и усечем
    const joined = array.join(', ');
    
    if (joined.length <= maxLen)
        return joined;
    
    return array[0];
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
