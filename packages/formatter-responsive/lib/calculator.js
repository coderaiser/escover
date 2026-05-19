const SCROLL = 2;

export const calculate = (columns) => {
    const totalWidth = (columns || 80) - SCROLL;
    const showPercent = totalWidth >= 70;
    
    const linesColWidth = Math.floor(totalWidth / 2);
    const percentColWidth = showPercent ? 7 : 0;
    
    const fileColWidth = Math.max(10, totalWidth - linesColWidth - percentColWidth - 10);
    
    return {
        showPercent,
        linesColWidth,
        percentColWidth,
        fileColWidth,
    };
};
