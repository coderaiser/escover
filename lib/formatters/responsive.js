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

    const tableData = [
        ['File', ...(showPercent ? ['% Lines'] : []), 'Uncovered Lines #s'],
    ];

    for (const {filename, covered, lines, percentLines} of files) {
        const fileCell = formatPath(filename, fileColWidth);
        const uncoveredLines = formatLines(lines, linesColWidth, showPercent);

        if (covered) {
            tableData.push([
                makeGreen(fileCell),
                ...(showPercent ? [makeGreen(percentLines)] : []),
                '',
            ]);
            continue;
        }

        tableData.push([
            makeRed(fileCell),
            ...(showPercent ? [makeRed(percentLines)] : []),
            makeRed(uncoveredLines),
        ]);
    }

    return table(tableData, {
        drawHorizontalLine: (raw) => {
            return !raw || raw === 1 || raw === files.length + 1;
        },
        columns: [
            {
                paddingLeft: 1,
                paddingRight: 1,
                width: fileColWidth,
            },
            ...(showPercent
                ? [{
                    alignment: 'center',
                    paddingLeft: 1,
                    paddingRight: 0,
                    width: percentColWidth,
                }]
                : []),
            {
                paddingLeft: 1,
                paddingRight: 0,
                width: linesColWidth,
            },
        ],
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

export function formatLines(array, width, showPercent) {
    const max = Math.max(10, Math.floor(width / 3));

    if (array.length <= 10) {
        const joined = array.join(', ');
        if (joined.length <= max)
            return joined;
    }

    const first = array[0];
    const last = array.at(-1);

    const base = `${first}..${last}`;

    if (base.length <= max)
        return base;

    return `${last}`;
}

function formatPath(path, width) {
    const max = Math.max(20, Math.floor(width));

    if (path.length <= max)
        return path;

    return `...${path.slice(-(max - 3))}`;
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
