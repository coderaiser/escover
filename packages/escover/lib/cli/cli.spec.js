import process from 'node:process';
import {test, stub} from 'supertape';
import {version} from './version.js';
import {help} from './help.js';
import {
    cli,
    createNodeOptions,
    execute,
    isSuccess,
    getOverallPercent,
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
            checkCoverage: false,
            lines: 100,
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
            checkCoverage: false,
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
            checkCoverage: false,
            lines: 100,
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
            checkCoverage: false,
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
            checkCoverage: false,
            lines: 100,
        }),
        stdout: {
            write: stub(),
        },
        getReport: report,
    });
    const args = [
        coverage, {
            skipFull: false,
            checkCoverage: false,
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
    const result = createNodeOptions('--abc');
    const expected = '--import escover/register --abc';
    
    t.equal(result, expected);
    t.end();
});

test('escover: cli: NODE_OPTIONS: already set', (t) => {
    const result = createNodeOptions('--import escover/register');
    const expected = '--import escover/register';
    
    t.equal(result, expected);
    t.end();
});

test('escover: cli: NODE_OPTIONS: empty', (t) => {
    const result = createNodeOptions('');
    const expected = '--import escover/register ';
    
    t.equal(result, expected);
    t.end();
});

test('escover: cli: NODE_OPTIONS: no', (t) => {
    const result = createNodeOptions();
    const expected = '--import escover/register ';
    
    t.equal(result, expected);
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

test('escover: cli: getOverallPercent: empty coverage returns 100', (t) => {
    const result = getOverallPercent([]);
    
    t.equal(result, 100);
    t.end();
});

test('escover: cli: getOverallPercent: fully covered returns 100', (t) => {
    const coverage = [{
        name: 'test.js',
        lines: {
            '1:0': true,
            '2:0': true,
            '3:0': true,
        },
    }];
    
    const result = getOverallPercent(coverage);
    
    t.equal(result, 100);
    t.end();
});

test('escover: cli: getOverallPercent: partial coverage returns correct percent', (t) => {
    const coverage = [{
        name: 'test.js',
        lines: {
            '1:0': true,
            '2:0': false,
            '3:0': true,
            '4:0': false,
        },
    }];
    
    const result = getOverallPercent(coverage);
    
    t.equal(result, 50);
    t.end();
});

test('escover: cli: getOverallPercent: all uncovered returns 0', (t) => {
    const coverage = [{
        name: 'test.js',
        lines: {
            '1:0': false,
            '2:0': false,
        },
    }];
    
    const result = getOverallPercent(coverage);
    
    t.equal(result, 0);
    t.end();
});

test('escover: cli: getOverallPercent: no lines in files returns 100', (t) => {
    const coverage = [{
        name: 'test.js',
        lines: {},
    }];
    
    const result = getOverallPercent(coverage);
    
    t.equal(result, 100);
    t.end();
});

test('escover: cli: checkCoverage: passes when coverage meets threshold', async (t) => {
    const argv = [
        'node',
        'escover',
        'tape',
        'test.js',
    ];
    
    const exit = stub();
    
    const coverage = [{
        name: 'test.js',
        lines: {
            '1:0': true,
            '2:0': true,
        },
    }];
    
    await cli({
        argv,
        exit,
        readCoverage: stub().returns(coverage),
        readConfig: stub().returns({
            skipFull: false,
            checkCoverage: true,
            lines: 80,
        }),
        stdout: {
            write: stub(),
        },
        stderr: {
            write: stub(),
        },
        getReport: stub().returns('output'),
        execute: stub(),
    });
    
    t.notCalled(exit);
    t.end();
});

test('escover: cli: checkCoverage: exits 1 when coverage below threshold', async (t) => {
    const argv = [
        'node',
        'escover',
        'tape',
        'test.js',
    ];
    
    const exit = stub();
    
    const coverage = [{
        name: 'test.js',
        lines: {
            '1:0': true,
            '2:0': false,
        },
    }];
    
    await cli({
        argv,
        exit,
        readCoverage: stub().returns(coverage),
        readConfig: stub().returns({
            skipFull: false,
            checkCoverage: true,
            lines: 90,
        }),
        stdout: {
            write: stub(),
        },
        stderr: {
            write: stub(),
        },
        getReport: stub().returns('output'),
        execute: stub(),
    });
    
    t.calledWith(exit, [1]);
    t.end();
});

test('escover: cli: checkCoverage: writes error message to stderr when below threshold', async (t) => {
    const argv = [
        'node',
        'escover',
        'tape',
        'test.js',
    ];
    
    const exit = stub();
    
    const stderr = {
        write: stub(),
    };
    
    const coverage = [{
        name: 'test.js',
        lines: {
            '1:0': true,
            '2:0': false,
        },
    }];
    
    await cli({
        argv,
        exit,
        readCoverage: stub().returns(coverage),
        readConfig: stub().returns({
            skipFull: false,
            checkCoverage: true,
            lines: 90,
        }),
        stdout: {
            write: stub(),
        },
        stderr,
        getReport: stub().returns('output'),
        execute: stub(),
    });
    
    t.calledWith(stderr.write, ['ERROR: lines coverage 50% is below threshold (90%)\n']);
    t.end();
});

test('escover: cli: checkCoverage: false skips check even when coverage is 0%', async (t) => {
    const argv = [
        'node',
        'escover',
        'tape',
        'test.js',
    ];
    
    const exit = stub();
    
    const coverage = [{
        name: 'test.js',
        lines: {
            '1:0': false,
        },
    }];
    
    await cli({
        argv,
        exit,
        readCoverage: stub().returns(coverage),
        readConfig: stub().returns({
            skipFull: false,
            checkCoverage: false,
            lines: 100,
        }),
        stdout: {
            write: stub(),
        },
        stderr: {
            write: stub(),
        },
        getReport: stub().returns('output'),
        execute: stub(),
    });
    
    t.notCalled(exit);
    t.end();
});

test('escover: cli: checkCoverage: passes checkCoverage to report', async (t) => {
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
            checkCoverage: true,
            lines: 100,
        }),
        stdout: {
            write: stub(),
        },
        stderr: {
            write: stub(),
        },
        getReport: report,
        execute: stub(),
    });
    const args = [
        coverage, {
            skipFull: false,
            checkCoverage: true,
        },
    ];
    
    t.calledWith(report, args);
    t.end();
});
