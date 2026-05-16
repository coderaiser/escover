import {cwd} from 'node:process';
import {getLinesPercent} from './responsive.js';

const CWD = cwd();
const {entries, keys} = Object;

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
