import chalk from 'chalk';
import {formatLines} from './format-lines.js';
import {groupByFolder} from './group-by-folder.js';
import {truncateMiddle} from './truncate.js';

const makeGreen = chalk.hex('#4caf50');
const makeRed = chalk.hex('#f44336');

// the last empty header always fits, so no fallback is needed
const LINES_HEADERS = [
    'Uncovered Lines #s',
    'Uncovered',
    'Lines',
    '',
];

const isHide = (groups) => groups.size === 1 && groups
    .keys()
    .next()
    .value === 'lib';

export const getColor = (value) => value === 100 ? makeGreen : makeRed;

const getLinesHeader = (width) => LINES_HEADERS.find((header) => header.length <= width);

export function buildGroupedTable({files, showPercent, linesColWidth, fileColWidth}) {
    const tableData = [];
    const showLines = linesColWidth > 0;
    
    const header = ['File'];
    
    if (showPercent)
        header.push('% Lines');
    
    if (showLines)
        header.push(getLinesHeader(linesColWidth));
    
    tableData.push(header);
    
    const groups = groupByFolder(files);
    const hideFolders = isHide(groups);
    
    for (const [folder, group] of groups) {
        let sum = 0;
        
        for (const {percentLines} of group.files)
            sum += percentLines;
        
        const coverage = Math.round(sum / group.files.length);
        
        if (!hideFolders) {
            const row = [];
            
            const shortFolder = truncateMiddle(folder, fileColWidth);
            row.push(getColor(coverage)(shortFolder));
            
            if (showPercent)
                row.push(getColor(coverage)(`${coverage}%`));
            
            if (showLines)
                row.push('');
            
            tableData.push(row);
        }
        
        for (const {covered, lines, fileName, percentLines} of group.files) {
            const row = [];
            
            // one character is taken by the indent
            const shortName = truncateMiddle(fileName, fileColWidth - 1);
            const coloredShortName = covered ? makeGreen(shortName) : makeRed(shortName);
            
            row.push(` ${coloredShortName}`);
            
            if (showPercent) {
                const percent = percentLines === 100 ? makeGreen(`${percentLines}%`) : makeRed(`${percentLines}%`);
                row.push(percent);
            }
            
            if (showLines)
                row.push(covered ? '' : makeRed(formatLines(
                    lines,
                    linesColWidth,
                )));
            
            tableData.push(row);
        }
    }
    
    return tableData;
}
