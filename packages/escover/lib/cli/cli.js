import {execSync} from 'node:child_process';
import process from 'node:process';
import {tryCatch} from 'try-catch';
import yargsParser from 'yargs-parser';
import {version} from './version.js';
import {readConfig} from '../config.js';
import {help} from './help.js';

const {env} = process;
const {NODE_OPTIONS, ESCOVER_FORMAT} = env;

export const createNodeOptions = (options = NODE_OPTIONS || '') => {
    if (!options.includes('escover/register'))
        return `--import escover/register ${options}`;
    
    return options;
};

export const cli = async ({argv, exit, readCoverage}) => {
    const {skipFull} = readConfig();
    const args = yargsParser(argv.slice(2), {
        string: ['format'],
        boolean: ['version', 'skip-full', 'help'],
        alias: {
            v: 'version',
            f: 'format',
            h: 'help',
        },
        default: {
            'format': ESCOVER_FORMAT || 'responsive',
            'skip-full': skipFull,
        },
    });
    
    if (args.version) {
        console.log(`v${version()}`);
        return exit();
    }
    
    if (args.help) {
        console.log(help());
        return exit();
    }
    
    if (args.help) {
        console.log(help());
        return exit();
    }
    
    const cmd = argv.slice(2);
    
    if (cmd.length)
        execute(`"${cmd.join('" "')}"`, exit);
    
    const coverage = readCoverage();
    
    const {default: report} = await import(`@escover/formatter-${args.format}`);
    
    const output = report(coverage, {
        skipFull,
    });
    
    /*
    if (args.format === 'lines')
        output = reportLines(coverage);
    else if (args.format === 'responsive')
        output = reportResponsive(coverage, {
            skipFull: args.skipFull,
        });
    else if (args.format === 'istanbul')
        output = reportIstanbul(coverage);
    else
        output = reportFiles(coverage);
     */
    process.stdout.write(output);
};

export const isSuccess = (error) => !error || error?.status === Number(process.env.ESCOVER_SUCCESS_EXIT_CODE);

function execute(cmd, exit) {
    const [error] = tryCatch(execSync, cmd, {
        stdio: [0, 1, 2],
        env: {
            ...process.env,
            NODE_OPTIONS: createNodeOptions(),
        },
    });
    
    if (isSuccess(error))
        return;
    
    if (error) {
        console.error(error.message);
        return exit(1);
    }
}
