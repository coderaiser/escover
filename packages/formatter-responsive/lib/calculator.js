const SCROLL = 2;
const PERCENT_WIDTH = 7;
const MIN_FILE_WIDTH = 10;
const MIN_LINES_WIDTH = 5;

// wide terminals keep the full 'Uncovered Lines #s' header
const FULL_HEADER_WIDTH = 18;

// every column has 1 padding on each side and a separator, plus 1 outer border
const getFrameWidth = (columnsCount) => columnsCount * 3 + 1;

export const calculate = (columns, linesNeeded = 0) => {
    const totalWidth = (columns || 80) - SCROLL;
    const showPercent = totalWidth >= 70;
    const showLines = linesNeeded > 0;
    
    const percentColWidth = showPercent ? PERCENT_WIDTH : 0;
    const columnsCount = 1 + Number(showPercent) + Number(showLines);
    const content = totalWidth - getFrameWidth(columnsCount) - percentColWidth;
    
    const minLinesWidth = showPercent ? FULL_HEADER_WIDTH : MIN_LINES_WIDTH;
    const linesColWidth = showLines ? Math.max(minLinesWidth, Math.min(
        linesNeeded,
        Math.floor(content / 2),
    )) : 0;
    const fileColWidth = Math.max(MIN_FILE_WIDTH, content - linesColWidth);
    
    return {
        showPercent,
        linesColWidth,
        percentColWidth,
        fileColWidth,
    };
};
