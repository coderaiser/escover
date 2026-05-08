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
    
    let showPercent = false;
    
    if (totalWidth >= 70)
        showPercent = true;
    
    let percentColWidth = 0;
    
    if (showPercent)
        percentColWidth = 8;
    
    const fileColWidth = Math.floor(totalWidth * 0.45);
    const linesColWidth = totalWidth - fileColWidth - percentColWidth - 6;
    
    const tableData = buildGroupedTable(files, showPercent);
    
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
            paddingRight: 0,
            width: percentColWidth,
        });
    
    columns.push({
        paddingLeft: 1,
        paddingRight: 0,
        width: linesColWidth,
    });
    
    const options = {
        drawHorizontalLine: (raw) => {
            if (!raw)
                return true;
            
            if (raw === 1)
                return true;
            
            return raw === tableData.length;
        },
        
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
    
    return table(tableData, options);
};

function groupByFolder(files) {
    const groups = new Map();
    
    for (const f of files) {
        const parts = f.filename.split('/');
        
        let folder = '';
        
        if (parts.length > 1)
            folder = parts
                .slice(0, -1)
                .join('/');
        
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

function buildGroupedTable(files, showPercent) {
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
    
    for (const [folder, group] of groups) {
        let sum = 0;
        
        for (const f of group.files)
            sum += f.percentLines;
        
        let coverage = 100;
        
        if (group.files.length > 0)
            coverage = Math.round(sum / group.files.length);
        
        let folderLabel = folder;
        
        if (!folderLabel)
            folderLabel = '.';
        
        const trimmedFolder = trim(folderLabel, 25) + '/';
        const folderName = makeRed(trimmedFolder);
        
        const headerRow = [folderName];
        
        if (showPercent) {
            let color = makeRed;
            
            if (coverage === 100)
                color = makeGreen;
            
            headerRow.push(color(`${coverage}%`));
        }
        
        headerRow.push('');
        tableData.push(headerRow);
        
        for (const f of group.files) {
            const fileCell = ' ' + trim(f.shortName, 30);
            
            let fileColor = makeRed;
            
            if (f.covered)
                fileColor = makeGreen;
            
            const row = [fileColor(fileCell)];
            
            if (showPercent) {
                let percentColor = makeRed;
                
                if (f.percentLines === 100)
                    percentColor = makeGreen;
                
                row.push(percentColor(`${f.percentLines}%`));
            }
            
            let uncovered = '';
            
            if (!f.covered)
                uncovered = makeRed(formatLines(f.lines));
            
            row.push(uncovered);
            
            tableData.push(row);
        }
    }
    
    return tableData;
}

function parseCoverageFile(coverageFile, skipFull) {
    const files = [];
    
    for (const {name, lines} of coverageFile) {
        const uncovered = parseUncoveredLines(lines);
        
        const linesCount = keys(lines).length;
        const uncoveredCount = uncovered.length;
        
        const percentLines = getLinesPercent(linesCount, uncoveredCount);
        
        let covered = true;
        
        if (uncoveredCount > 0)
            covered = false;
        
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

function trim(str, max) {
    if (str.length <= max)
        return str;
    
    return '...' + str.slice(-(max - 3));
}

export function formatLines(array) {
    if (array.length <= 10) {
        const joined = array.join(', ');
        
        if (joined.length <= 30)
            return joined;
    }
    
    const [first] = array;
    const last = array.at(-1);
    
    const base = first + '..' + last;
    
    if (base.length <= 30)
        return base;
    
    return last;
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
    
    const ratio = 100 / linesCount * uncoveredLinesCount;
    
    return 100 - Math.round(ratio);
}
