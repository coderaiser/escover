import {getBorderCharacters} from 'table';

export function createTableOptions({showPercent, tableData, fileColWidth, percentColWidth, linesColWidth}) {
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
            paddingRight: 1,
            width: percentColWidth,
        });
    
    columns.push({
        paddingLeft: 1,
        paddingRight: 1,
        width: linesColWidth,
        wrapWord: false,
    });
    
    return {
        drawHorizontalLine: (i) => !i || i === 1 || i === tableData.length,
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
}
