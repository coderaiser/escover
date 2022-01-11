import {promisify} from 'util';
import yargsParser from 'yargs-parser';
import _foreground from 'foreground-child';

import {version} from './version.js';
import {report} from '../report.js';

const foreground = promisify((cmd, fn) => {
    _foreground(cmd, () => {
        fn();
    });
});

process.env.ZENLOAD = 'escover,mock-import';

export const cli = async ({argv, exit, read}) => {
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
    
    const cmd = hideInstrumenterArgs(args);
    
    if (!cmd.length)
        return;
    
    await foreground(cmd);
    const coverage = read();
    
    report(coverage);
};

function hideInstrumenterArgs(yargv) {
    let argv = process.argv.slice(1);
    
    argv = argv.slice(argv.indexOf(yargv._[0]));
    
    if (argv[0][0] === '-') {
        argv.unshift(process.execPath);
    }
    
    return argv;
}

