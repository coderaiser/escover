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

export default (coverageFile) => {
    const files = parseCoverageFile(coverageFile);
    
    const totalWidth = process.stdout.columns || 80;
    const showPercent = totalWidth >= 70;
    
    const percentColWidth = showPercent ? 8 : 0;
    const fileColWidth = Math.floor(totalWidth * 0.45);
    const linesColWidth = totalWidth - fileColWidth - percentColWidth - 6;
    
    const tableData = buildGroupedTable(files);
    
    return table(tableData, {
        drawHorizontalLine: (raw) => !raw || raw === 1 || raw === tableData.length,
        
        columns: [{
            paddingLeft: 1,
            paddingRight: 1,
            width: fileColWidth,
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

/* =========================
   GROUPING + COVERAGE
========================= */
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
                total: 0,
                covered: 0,
            });
        
        const group = groups.get(folder);
        
        group.files.push({
            ...f,
            shortName: fileName,
        });
        
        ++group.total;
        
        if (f.covered)
            ++group.covered;
    }
    
    return groups;
}

function buildGroupedTable(files) {
    const tableData = [
        ['File', '% Lines', 'Uncovered Lines #s'],
    ];
    
    const groups = groupByFolder(files);
    
    for (const [folder, group] of groups) {
        const coverage = group.total ? Math.round(group.covered / group.total * 100) : 100;
        
        const folderLabel = folder || '.';
        
        // 🎯 цвет папки: только имя всегда green
        const folderName = makeGreen(`${folderLabel}/`);
        
        // 🎯 цвет процента папки (ВАЖНО)
        const folderPercentColor = coverage === 100 ? makeGreen : makeRed;
        
        tableData.push([folderName, folderPercentColor(`${coverage}%`), '']);
        
        for (const f of group.files) {
            const fileCell = ` ${formatPath(f.shortName)}`; // 1 пробел как в c8
            const uncoveredLines = formatLines(f.lines);
            
            const filePercentColor = f.percentLines === 100 ? makeGreen : makeRed;
            
            if (f.covered) {
                tableData.push([
                    makeGreen(fileCell),
                    makeGreen(`${f.percentLines}%`),
                    '',
                ]);
                continue;
            }
            
            tableData.push([
                makeRed(fileCell),
                filePercentColor(`${f.percentLines}%`),
                makeRed(uncoveredLines),
            ]);
        }
    }
    
    return tableData;
}

/* =========================
   PARSE
========================= */
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

/* =========================
   FORMATTERS
========================= */
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

function formatPath(path) {
    const max = 30;
    
    if (path.length <= max)
        return path;
    
    return `...${path.slice(-(max - 3))}`;
}

/* =========================
   HELPERS
========================= */
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
