import libCoverage from 'istanbul-lib-coverage';
import libReport from 'istanbul-lib-report';
import reports from 'istanbul-reports';
import {toIstanbul} from './converter.js';

export default (coverageFile) => {
    const coverageMap = libCoverage.createCoverageMap(toIstanbul(coverageFile));
    
    const context = libReport.createContext({
        dir: './coverage-html',
        coverageMap,
    });
    
    reports
        .create('text')
        .execute(context);
    
    return '';
};
