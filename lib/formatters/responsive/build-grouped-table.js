import chalk from 'chalk';
import {formatLines} from './format-lines.js';
import {groupByFolder} from './group-by-folder.js';

const makeGreen = chalk.hex('#4caf50');
const makeRed = chalk.hex('#f44336');

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
            const coloredShortName = f.covered ? makeGreen(' ' + f.shortName) : makeRed(' ' + f.shortName);
            
            row.push(coloredShortName);
            
            if (showPercent) {
                const percent = f.percentLines === 100 ? makeGreen(`${f.percentLines}%`) : makeRed(`${f.percentLines}%`);
                row.push(percent);
            }
            
            row.push(f.covered ? '' : makeRed(formatLines(
                f.lines,
                linesColWidth,
            )));
            
            tableData.push(row);
        }
    }
    
    return tableData;
}
