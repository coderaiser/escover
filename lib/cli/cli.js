import {execSync} from 'child_process';
import tryCatch from 'try-catch';
import yargsParser from 'yargs-parser';
import {version} from './version.js';
import reportLines from '../formatters/lines.js';
import reportFiles from '../formatters/files.js';
import {exit as mainExit} from '../exit.js';

const {ESCOVER_FORMAT} = process.env;

export const ESCOVER_NODE_OPTIONS = '--no-warnings --loader zenload';

export const cli = ({argv, exit, readCoverage}) => {
    const args = yargsParser(argv.slice(2), {
        string: ['format'],
        boolean: ['version'],
        alias: {
            v: 'version',
            f: 'format',
        },
        default: {
            format: ESCOVER_FORMAT || 'files',
        },
    });
    
    if (args.version) {
        console.log(`v${version()}`);
        return exit();
    }
    
    const cmd = argv.slice(2);
    
    if (cmd.length) {
        execute(`"${cmd.join('" "')}"`, () => {});
    }
    
    const coverage = readCoverage();
    
    let output = '';
    
    if (args.format === 'lines')
        output = reportLines(coverage);
    else
        output = reportFiles(coverage);
    
    process.stdout.write(output);
};

export const isSuccess = (error) => !error || error?.status === Number(process.env.ESCOVER_SUCCESS_EXIT_CODE);

function execute(cmd, exit) {
    const [error] = tryCatch(execSync, cmd, {
        stdio: [0, 1, 2],
        env: {
            ZENLOAD: 'escover,mock-import',
            ...process.env,
            NODE_OPTIONS: ESCOVER_NODE_OPTIONS,
        },
    });
    
    if (isSuccess(error)) {
        return exit(0);
    }
    
    if (error) {
        console.error(error.message);
        return exit(1);
    }
}
