import {execSync} from 'child_process';
import tryCatch from 'try-catch';
import yargsParser from 'yargs-parser';

import {version} from './version.js';
import reportLines from '../formatters/lines.js';
import reportFiles from '../formatters/files.js';

export const cli = ({argv, exit, read}) => {
    const args = yargsParser(argv.slice(2), {
        string: [
            'format',
        ],
        boolean: [
            'version',
        ],
        alias: {
            v: 'version',
            f: 'format',
        },
        default: {
            format: 'files',
        },
    });
    
    if (args.version) {
        console.log(`v${version()}`);
        return exit();
    }
    
    const cmd = argv.slice(2);
    
    if (cmd.length) {
        execute('"' + cmd.join(`" "`) + '"', exit);
    }
    
    const coverage = read();
    
    if (args.format === 'lines')
        return reportLines(coverage);
    
    reportFiles(coverage);
};

function execute(cmd, exit) {
    const [error] = tryCatch(execSync, cmd, {
        stdio: [0, 1, 2],
        env: {
            ...process.env,
            NODE_OPTIONS: '--no-warnings --loader zenload',
            ZENLOAD: 'escover,mock-import',
        },
    });
    
    if (error) {
        console.error(error.message);
        return exit(1);
    }
}
