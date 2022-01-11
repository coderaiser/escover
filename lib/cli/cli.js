import yargsParser from 'yargs-parser';

import {version} from './version.js';
import {report} from '../report.js';

export const cli = ({argv, exit, read}) => {
    const args = yargsParser(argv.slice(2), {
        boolean: [
            'version',
        ],
        alias: {
            v: 'version',
        },
        configuration: {},
    });
    
    if (args.version) {
        console.log(`v${version()}`);
        return exit();
    }
    
    const coverage = read();
    report(coverage);
};
