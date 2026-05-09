import chalk from 'chalk';
import {formatLines} from './format-lines.js';
import {groupByFolder} from './group-by-folder.js';

const makeGreen = chalk.hex('#4caf50');
const makeRed = chalk.hex('#f44336');

export const getColor = (value) => value === 100 ? makeGreen : makeRed;

function truncateLeft(str, maxLength) {
    if (str.length <= maxLength)
        return str;
    
    return `...${str.slice(str.length - maxLength + 5)}`;
}

export function buildGroupedTable({files, showPercent, linesColWidth, fileColWidth}) {
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
            
            const shortFolder = truncateLeft(folder, fileColWidth);
            row.push(getColor(coverage)(shortFolder));
            
            if (showPercent)
                row.push(getColor(coverage)(`${coverage}%`));
            
            row.push('');
            tableData.push(row);
        }
        
        for (const {covered, lines, fileName, percentLines} of group.files) {
            const row = [];
            const shortName = truncateLeft(fileName, fileColWidth);
            const coloredShortName = covered ? makeGreen(shortName) : makeRed(shortName);
            
            row.push(coloredShortName);
            
            if (showPercent) {
                const percent = percentLines === 100 ? makeGreen(`${percentLines}%`) : makeRed(`${percentLines}%`);
                row.push(percent);
            }
            
            row.push(covered ? '' : makeRed(formatLines(
                lines,
                linesColWidth,
            )));
            
            tableData.push(row);
        }
    }
    
    return tableData;
}
