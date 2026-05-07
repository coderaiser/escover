import {execSync} from 'node:child_process';
import process from 'node:process';
import {tryCatch} from 'try-catch';
import yargsParser from 'yargs-parser';
import {version} from './version.js';
import reportLines from '../formatters/lines.js';
import reportFiles from '../formatters/files.js';
import reportResponsive from '../formatters/responsive.js';

const {env} = process;

const noop = () => {};

const {NODE_OPTIONS, ESCOVER_FORMAT} = env;

export const createNodeOptions = (options = NODE_OPTIONS || '') => {
    if (!options.includes('escover/register'))
        return `--import escover/register ${options}`;
    
    return options;
};

export const cli = ({argv, exit, readCoverage}) => {
    const args = yargsParser(argv.slice(2), {
        string: ['format'],
        boolean: ['version'],
        alias: {
            v: 'version',
            f: 'format',
        },
        default: {
            format: ESCOVER_FORMAT || 'responsive',
        },
    });
    
    if (args.version) {
        console.log(`v${version()}`);
        return exit();
    }
    
    const cmd = argv.slice(2);
    
    if (cmd.length)
        execute(`"${cmd.join('" "')}"`, noop);
    
    const coverage = readCoverage();
    
    let output = '';
    
    if (args.format === 'lines')
        output = reportLines(coverage);
    else if (args.format === 'responsive')
        output = reportResponsive(coverage);
    else
        output = reportFiles(coverage);
    
    process.stdout.write(output);
};

export const isSuccess = (error) => !error || error?.status === Number(process.env.ESCOVER_SUCCESS_EXIT_CODE);

function execute(cmd, exit) {
    console.log(createNodeOptions());
    const [error] = tryCatch(execSync, cmd, {
        stdio: [0, 1, 2],
        env: {
            ...process.env,
            NODE_OPTIONS: createNodeOptions(),
        },
    });
    
    if (isSuccess(error))
        return exit(0);
    
    if (error) {
        console.error(error.message);
        return exit(1);
    }
}
