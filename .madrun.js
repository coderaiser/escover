import {
    run,
    cutEnv,
} from 'madrun';

const NODE_OPTIONS = `'--no-warnings --loader zenload'`;
const ZENLOAD = [
    'escover',
    'mock-import',
].join();

const testEnv = {
    NODE_OPTIONS,
    ZENLOAD,
};

const coverageEnv = {
    ZENLOAD: 'mock-import',
};

export default {
    'test': () => `tape 'test/**/*.js' 'lib/**/*.spec.js' 'example/*.spec.js'`,
    'coverage': async () => [coverageEnv, `c8 ${await cutEnv('test')}`],
    'c4': async () => [testEnv, `tape 'lib/instrument/**/*.spec.js' 'example/*.spec.js'`],
    'lint': () => 'putout .',
    'fresh:lint': () => run('lint', '--fresh'),
    'lint:fresh': () => run('lint', '--fresh'),
    'fix:lint': () => run('lint', '--fix'),
    'report': () => 'c8 report --reporter=lcov',
    'watcher': () => 'nodemon -w test -w lib --exec',
    
    'watch:test': async () => await run('watcher', `"${await cutEnv('test')}"`, testEnv),
    
    'watch:lint': async () => await run('watcher', `'npm run lint'`),
    'watch:tape': () => 'nodemon -w test -w lib --exec tape',
    
    'watch:coverage': async () => await run('watcher', await cutEnv('coverage'), testEnv),
};

