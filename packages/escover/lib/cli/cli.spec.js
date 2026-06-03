import process from 'node:process';
import {test, stub} from 'supertape';
import {version} from './version.js';
import {help} from './help.js';
import {
    cli,
    createNodeOptions,
    execute,
    isSuccess,
} from './cli.js';

const VERSION = `v${version()}`;
const HELP = help();

test('escover: cli: cli: version', async (t) => {
    const argv = [
        'node',
        'escover',
        '--version',
    ];
    
    const exit = stub();
    const log = stub();
    
    await cli({
        argv,
        exit,
        readCoverage: stub(),
        readConfig: stub().returns({
            skipFull: false,
        }),
        log,
    });
    
    t.calledWith(log, [VERSION]);
    t.end();
});

test('escover: cli: cli: version: exit', async (t) => {
    const argv = [
        'node',
        'escover',
        '--version',
    ];
    
    const exit = stub();
    const log = stub();
    
    await cli({
        argv,
        exit,
        readCoverage: stub(),
        readConfig: stub().returns({
            skipFull: false,
        }),
        log,
    });
    
    t.calledWithNoArgs(exit);
    t.end();
});

test('escover: cli: cli: version: short', async (t) => {
    const argv = [
        'node',
        'escover',
        '-v',
    ];
    
    const exit = stub();
    const log = stub();
    
    await cli({
        argv,
        exit,
        readCoverage: stub(),
        readConfig: stub().returns({
            skipFull: false,
        }),
        log,
    });
    
    t.calledWith(log, [VERSION]);
    t.end();
});

test('escover: cli: cli: help', async (t) => {
    const argv = [
        'node',
        'escover',
        '--help',
    ];
    
    const exit = stub();
    const log = stub();
    
    await cli({
        argv,
        exit,
        readCoverage: stub(),
        readConfig: stub().returns({
            skipFull: false,
        }),
        log,
    });
    
    t.calledWith(log, [HELP]);
    t.end();
});

test('escover: cli: cli: help: short', async (t) => {
    const argv = [
        'node',
        'escover',
        '-h',
    ];
    
    const exit = stub();
    const log = stub();
    
    await cli({
        argv,
        exit,
        readCoverage: stub(),
        readConfig: stub().returns({
            skipFull: false,
        }),
        log,
    });
    
    t.calledWith(log, [HELP]);
    t.end();
});

test('escover: cli: cli: execute: cmd', async (t) => {
    const argv = [
        'node',
        'escover',
        'tape',
        'test.js',
    ];
    
    const exit = stub();
    const executeFn = stub();
    
    await cli({
        argv,
        exit,
        readCoverage: stub(),
        readConfig: stub().returns({
            skipFull: false,
        }),
        stdout: {
            write: stub(),
        },
        getReport: stub().returns('output'),
        execute: executeFn,
    });
    const args = [
        ['tape', 'test.js'], {
            exit,
        },
    ];
    
    t.calledWith(executeFn, args);
    t.end();
});

test('escover: cli: cli: execute: report', async (t) => {
    const argv = [
        'node',
        'escover',
        'tape',
        'test.js',
    ];
    
    const exit = stub();
    const coverage = [];
    const report = stub().returns('output');
    
    await cli({
        argv,
        exit,
        readCoverage: stub().returns(coverage),
        readConfig: stub().returns({
            skipFull: false,
        }),
        stdout: {
            write: stub(),
        },
        getReport: report,
        execute: stub(),
    });
    const args = [
        coverage, {
            skipFull: false,
        },
    ];
    
    t.calledWith(report, args);
    t.end();
});

test('escover: cli: cli: execute: write', async (t) => {
    const argv = [
        'node',
        'escover',
        'tape',
        'test.js',
    ];
    
    const exit = stub();
    
    const stdout = {
        write: stub(),
    };
    
    await cli({
        argv,
        exit,
        readCoverage: stub(),
        readConfig: stub().returns({
            skipFull: false,
        }),
        stdout,
        getReport: stub().returns('output'),
        execute: stub(),
    });
    
    t.calledWith(stdout.write, ['output']);
    t.end();
});

test('escover: cli: cli: skip-full', async (t) => {
    const argv = [
        'node',
        'escover',
        'tape',
        'test.js',
    ];
    
    const exit = stub();
    const coverage = [];
    const report = stub().returns('output');
    
    await cli({
        argv,
        exit,
        readCoverage: stub().returns(coverage),
        readConfig: stub().returns({
            skipFull: true,
        }),
        stdout: {
            write: stub(),
        },
        getReport: report,
        execute: stub(),
    });
    const args = [
        coverage, {
            skipFull: true,
        },
    ];
    
    t.calledWith(report, args);
    t.end();
});

test('escover: cli: cli: no command: report', async (t) => {
    const argv = [
        'node',
        'escover',
    ];
    
    const exit = stub();
    const coverage = [];
    const report = stub().returns('output');
    
    await cli({
        argv,
        exit,
        readCoverage: stub().returns(coverage),
        readConfig: stub().returns({
            skipFull: false,
        }),
        stdout: {
            write: stub(),
        },
        getReport: report,
    });
    const args = [
        coverage, {
            skipFull: false,
        },
    ];
    
    t.calledWith(report, args);
    t.end();
});

test('escover: cli: cli: no command: write', async (t) => {
    const argv = [
        'node',
        'escover',
    ];
    
    const exit = stub();
    
    const stdout = {
        write: stub(),
    };
    
    await cli({
        argv,
        exit,
        readCoverage: stub(),
        readConfig: stub().returns({
            skipFull: false,
        }),
        stdout,
        getReport: stub().returns('output'),
    });
    
    t.calledWith(stdout.write, ['output']);
    t.end();
});

test('escover: cli: isSuccess: no', (t) => {
    process.env.ESCOVER_SUCCESS_EXIT_CODE = '1';
    const result = isSuccess({
        status: 5,
    });
    
    delete process.env.ESCOVER_SUCCESS_EXIT_CODE;
    
    t.notOk(result);
    t.end();
});

test('escover: cli: isSuccess: yes', (t) => {
    process.env.ESCOVER_SUCCESS_EXIT_CODE = '5';
    const result = isSuccess({
        status: 5,
    });
    
    delete process.env.ESCOVER_SUCCESS_EXIT_CODE;
    
    t.ok(result);
    t.end();
});

test('escover: cli: NODE_OPTIONS: with quotes', (t) => {
    t.equal(createNodeOptions('--abc'), '--import escover/register --abc');
    t.end();
});

test('escover: cli: NODE_OPTIONS: already set', (t) => {
    t.equal(createNodeOptions('--import escover/register'), '--import escover/register');
    t.end();
});

test('escover: cli: NODE_OPTIONS: empty', (t) => {
    t.equal(createNodeOptions(''), '--import escover/register ');
    t.end();
});

test('escover: cli: NODE_OPTIONS: no', (t) => {
    t.equal(createNodeOptions(), '--import escover/register ');
    t.end();
});

test('escover: cli: execute: no quotes', (t) => {
    const env = {};
    const exit = stub();
    const cmd = ['tape', `'lib/**/*.spec.js'`];
    const run = stub();
    
    execute(cmd, {
        env,
        exit,
        run,
    });
    
    const args = [`"tape" "'lib/**/*.spec.js'"`, {
        env: {
            NODE_OPTIONS: '--import escover/register --unhandled-rejections=strict',
        },
        stdio: 'inherit',
    }];
    
    t.calledWith(run, args);
    t.end();
});

test('escover: cli: execute: quotes', (t) => {
    const env = {};
    const exit = stub();
    const cmd = [`tape 'test/*.js' 'lib/**/*.spec.js'`];
    const run = stub();
    
    execute(cmd, {
        env,
        exit,
        run,
    });
    
    const args = [`tape 'test/*.js' 'lib/**/*.spec.js'`, {
        env: {
            NODE_OPTIONS: '--import escover/register --unhandled-rejections=strict',
        },
        stdio: 'inherit',
    }];
    
    t.calledWith(run, args);
    t.end();
});

test('escover: cli: execute: error', (t) => {
    const exit = stub();
    const run = stub().throws(Error('test error'));
    
    execute(['cmd'], {
        exit,
        run,
    });
    
    t.calledWith(exit, [1]);
    t.end();
});

test('escover: cli: execute: success error', (t) => {
    const exit = stub();
    const run = stub().throws({
        status: 5,
    });
    
    process.env.ESCOVER_SUCCESS_EXIT_CODE = '5';
    execute(['cmd'], {
        exit,
        run,
    });
    delete process.env.ESCOVER_SUCCESS_EXIT_CODE;
    
    t.notCalled(exit);
    t.end();
});

test('escover: cli: cli: executeOverride fallback', async (t) => {
    const argv = [
        'node',
        'escover',
        'true',
    ];
    
    const exit = stub();
    
    const stdout = {
        write: stub(),
    };
    
    await cli({
        argv,
        exit,
        readCoverage: stub().returns([]),
        readConfig: stub().returns({
            skipFull: false,
        }),
        stdout,
        getReport: stub().returns(''),
    });
    
    t.calledWith(stdout.write, ['']);
    t.end();
});

test('escover: cli: execute: default run', (t) => {
    const exit = stub();
    
    execute(['true'], {
        exit,
    });
    
    t.notCalled(exit);
    t.end();
});

test('escover: cli: cli: readConfig fallback', async (t) => {
    const argv = [
        'node',
        'escover',
        '--version',
    ];
    
    const exit = stub();
    const log = stub();
    
    await cli({
        argv,
        exit,
        readCoverage: stub(),
        log,
    });
    
    t.calledWith(log, [VERSION]);
    t.end();
});

test('escover: cli: cli: getReport fallback', async (t) => {
    const argv = [
        'node',
        'escover',
    ];
    
    const exit = stub();
    
    const stdout = {
        write: stub(),
    };
    
    await cli({
        argv,
        exit,
        readCoverage: stub().returns([]),
        readConfig: stub().returns({
            skipFull: false,
        }),
        stdout,
    });
    
    t.ok(stdout.write.called, 'should write output');
    t.end();
});

test('escover: cli: execute: no run override', (t) => {
    const exit = stub();
    const run = stub().returns('ok');
    
    execute(['cmd'], {
        exit,
        run,
    });
    
    t.notCalled(exit);
    t.end();
});
