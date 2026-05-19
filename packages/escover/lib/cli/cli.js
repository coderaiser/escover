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
        execute(cmd, {
            exit,
        });
    
    const coverage = readCoverage();
    
    const {default: report} = await import(`@escover/formatter-${args.format}`);
    
    const output = report(coverage, {
        skipFull,
    });
    
    process.stdout.write(output);
};

export const isSuccess = (error) => !error || error?.status === Number(process.env.ESCOVER_SUCCESS_EXIT_CODE);

const maybeAddQuotes = (a) => {
    let start = '';
    let end = '';
    
    if (a.at(0) !== '"')
        start = '"';
    
    if (a.at(-1) !== '"')
        end = '"';
    
    return [start, a, end].join('');
};

export function execute(cmd, overrides) {
    const {
        exit,
        run = execSync,
        env = process.env,
    } = overrides;
    
    const safeCmd = maybeAddQuotes(cmd.join('" "'));
    
    const [error] = tryCatch(run, safeCmd, {
        stdio: 'inherit',
        env: {
            ...env,
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
