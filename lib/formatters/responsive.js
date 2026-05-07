import process from 'node:process';
import {
    table,
    getBorderCharacters,
} from 'table';
import chalk from 'chalk';

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
    
    const percentColWidth = showPercent ? 8 : 0;
    const fileColWidth = Math.floor(totalWidth * 0.45);
    const linesColWidth = totalWidth - fileColWidth - percentColWidth - 6;
    
    const tableData = buildGroupedTable(files, showPercent);
    
    return table(tableData, {
        drawHorizontalLine: (raw) => !raw || raw === 1 || raw === tableData.length,
        columns: [{
            paddingLeft: 1,
            paddingRight: 1,
            width: fileColWidth,
            wrapWord: false,
        }, ...showPercent ? [{
            alignment: 'center',
            paddingLeft: 1,
            paddingRight: 0,
            width: percentColWidth,
        }] : [], {
            paddingLeft: 1,
            paddingRight: 0,
            width: linesColWidth,
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

function groupByFolder(files) {
    const groups = new Map();
    
    for (const f of files) {
        const parts = f.filename.split('/');
        const folder = parts.length > 1 ? parts
            .slice(0, -1)
            .join('/') : '';
        const fileName = parts.at(-1);
        
        if (!groups.has(folder))
            groups.set(folder, {
                files: [],
            });
        
        groups.get(folder).files.push({
            ...f,
            shortName: fileName,
        });
    }
    
    return groups;
}

function buildGroupedTable(files, showPercent) {
    const tableData = [
        showPercent ? [
            'File',
            '% Lines',
            'Uncovered Lines #s',
        ] : [
            'File',
            'Uncovered Lines #s',
        ],
    ];
    
    const groups = groupByFolder(files);
    
    for (const [folder, group] of groups) {
        const coverage = group.files.length ? Math.round(group.files.reduce((s, f) => s + f.percentLines, 0) / group.files.length) : 100;
        
        const folderLabel = formatFolder(folder || '.');
        const folderName = makeRed(`${folderLabel}/`);
        const folderPercentColor = coverage === 100 ? makeGreen : makeRed;
        
        const headerRow = [folderName];
        
        if (showPercent)
            headerRow.push(folderPercentColor(`${coverage}%`));
        
        headerRow.push('');
        tableData.push(headerRow);
        
        for (const f of group.files) {
            const fileCell = ` ${formatPath(f.shortName)}`;
            const uncoveredLines = formatLines(f.lines);
            const filePercentColor = f.percentLines === 100 ? makeGreen : makeRed;
            
            const row = [f.covered ? makeGreen(fileCell) : makeRed(fileCell)];
            
            if (showPercent)
                row.push(filePercentColor(`${f.percentLines}%`));
            
            row.push(f.covered ? '' : makeRed(uncoveredLines));
            tableData.push(row);
        }
    }
    
    return tableData;
}

function parseCoverageFile(coverageFile, skipFull = false) {
    const files = [];
    
    for (const {name, lines} of coverageFile) {
        const filename = name.replace(`${CWD}/`, '');
        const uncoveredLines = parseUncoveredLines(lines);
        
        const linesCount = keys(lines).length;
        const uncoveredLinesCount = uncoveredLines.length;
        
        const percentLines = getLinesPercent(linesCount, uncoveredLinesCount);
        const isCovered = !uncoveredLinesCount;
        
        if (skipFull && isCovered)
            continue;
        
        files.push({
            filename,
            covered: isCovered,
            lines: uncoveredLines,
            percentLines,
        });
    }
    
    return files;
}

function formatPath(path) {
    const max = 30;
    return path.length <= max ? path : `...${path.slice(-(max - 3))}`;
}

function formatFolder(path) {
    const max = 25;
    return path.length <= max ? path : `...${path.slice(-(max - 3))}`;
}

export function formatLines(array) {
    const max = 30;
    
    if (array.length <= 10) {
        const joined = array.join(', ');
        
        if (joined.length <= max)
            return joined;
    }
    
    const [first] = array;
    const last = array.at(-1);
    const base = `${first}..${last}`;
    
    if (base.length <= max)
        return base;
    
    return String(last);
}

function parseUncoveredLines(lines) {
    const out = [];
    
    for (const [line, covered] of entries(lines)) {
        if (!covered)
            out.push(line);
    }
    
    return out;
}

export function getLinesPercent(linesCount, uncoveredLinesCount) {
    if (!linesCount)
        return 100;
    
    return 100 - Math.round(100 / linesCount * uncoveredLinesCount);
}
