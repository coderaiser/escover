import process from 'node:process';
import libCoverage from 'istanbul-lib-coverage';
import libReport from 'istanbul-lib-report';
import reports from 'istanbul-reports';
import {toIstanbul} from '@escover/converter-istanbul';

const {isArray} = Array;
const DIR = './coverage';

export default (coverageFile, overrides = {}) => {
    const {
        env = process.env,
        reporter = env.ISTANBUL_REPORTER || 'text',
        createReport = reports.create,
        createContext = libReport.createContext,
        createCoverageMap = libCoverage.createCoverageMap,
    } = overrides;
    
    check(coverageFile);
    
    const coverageMap = createCoverageMap(toIstanbul(coverageFile));
    
    const context = createContext({
        dir: DIR,
        coverageMap,
    });
    
    const report = createReport(reporter);
    
    report.execute(context);
    
    return '';
};

function check(coverageFile) {
    if (!isArray(coverageFile))
        throw Error(`☝️Looks like 'coverageFile' is not an array.`);
}
