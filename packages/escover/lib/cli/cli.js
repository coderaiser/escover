import {execSync} from 'node:child_process';
import process from 'node:process';
import {tryCatch} from 'try-catch';
import yargsParser from 'yargs-parser';
import {version} from './version.js';
import {readConfig} from '../config.js';
import {help} from './help.js';

const {env} = process;
const {NODE_OPTIONS, ESCOVER_FORMAT} = env;

export const createNodeOptions = (options = '') => {
    if (!options.includes('escover/register'))
        return `--import escover/register ${options}`;
    
    return options;
};

export const cli = async (overrides) => {
    const {
        argv,
        exit,
        readCoverage,
        readConfig: readConfigOverride,
        log = console.log,
        stdout = process.stdout,
        stderr = process.stderr,
        getReport,
        execute: executeOverride,
    } = overrides;
    
    const {
        skipFull,
        checkCoverage,
        lines: linesThreshold,
    } = (readConfigOverride || readConfig)();
    
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
        log(`v${version()}`);
        return exit();
    }
    
    if (args.help) {
        log(help());
        return exit();
    }
    
    const cmd = argv.slice(2);
    
    if (cmd.length) {
        const exec = executeOverride || execute;
        
        exec(cmd, {
            exit,
        });
    }
    
    const coverage = readCoverage();
    
    const report = getReport || (await import(`@escover/formatter-${args.format}`)).default;
    
    const output = report(coverage, {
        skipFull,
        checkCoverage,
    });
    
    stdout.write(output);
    
    if (checkCoverage) {
        const overallPercent = getOverallPercent(coverage);
        
        if (overallPercent < linesThreshold) {
            stderr.write(`ERROR: lines coverage ${overallPercent}% is below threshold (${linesThreshold}%)\n`);
            return exit(1);
        }
    }
};

export function getOverallPercent(coverage) {
    if (!coverage.length)
        return 100;
    
    let totalLines = 0;
    let totalUncovered = 0;
    
    for (const {lines} of coverage) {
        for (const covered of Object.values(lines)) {
            totalLines++;
            
            if (!covered)
                totalUncovered++;
        }
    }
    
    if (!totalLines)
        return 100;
    
    return Math.round(100 - 100 / totalLines * totalUncovered);
}

export const isSuccess = (error) => !error || error?.status === Number(process.env.ESCOVER_SUCCESS_EXIT_CODE);

const makeCmdSafe = (cmd) => {
    if (cmd.length === 1)
        return cmd.join('');
    
    return `"${cmd.join('" "')}"`;
};

export function execute(cmd, overrides) {
    const {
        exit,
        run = execSync,
        env = process.env,
    } = overrides;
    
    const safeCmd = makeCmdSafe(cmd);
    
    const [error] = tryCatch(run, safeCmd, {
        stdio: 'inherit',
        env: {
            ...env,
            NODE_OPTIONS: createNodeOptions(NODE_OPTIONS),
        },
    });
    
    if (isSuccess(error))
        return;
    
    if (error) {
        console.error(error.message);
        return exit(1);
    }
}
