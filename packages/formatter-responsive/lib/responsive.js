import process from 'node:process';
import {table} from 'table';
import {buildGroupedTable} from './build-grouped-table.js';
import {calculate} from './calculator.js';
import {parseCoverageFile} from './parser.js';
import {createTableOptions} from './table.js';

const {stdout} = process;

export default (coverageFile, overrides = {}) => {
    const {
        skipFull = false,
        columns = stdout.columns,
    } = overrides;
    
    const files = parseCoverageFile(coverageFile, skipFull);
    
    if (skipFull && !files.length)
        return '💪 coverage 100%, good job!\n';
    
    const {
        showPercent,
        linesColWidth,
        percentColWidth,
        fileColWidth,
    } = calculate(columns);
    
    const tableData = buildGroupedTable({
        files,
        showPercent,
        linesColWidth,
        fileColWidth,
    });
    
    const options = createTableOptions({
        showPercent,
        tableData,
        fileColWidth,
        percentColWidth,
        linesColWidth,
    });
    
    return table(tableData, options);
};
