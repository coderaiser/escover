import {SKIPPED} from 'supertape/exit-codes';
import {run, cutEnv} from 'madrun';

const env = {
    SUPERTAPE_CHECK_SKIPPED: 1,
    ESCOVER_SUCCESS_EXIT_CODE: SKIPPED,
};

const coverageEnv = {
    ESCOVER_FORMAT: 'lines',
};

export default {
    'test': () => [env, `bin/escover.js tape 'test/**/*.js' 'lib/**/*.spec.js' 'example/*.spec.js'`],
    'coverage': async () => [coverageEnv, `c8 ${await cutEnv('test')}`],
    'lint': () => 'putout .',
    'fresh:lint': () => run('lint', '--fresh'),
    'lint:fresh': () => run('lint', '--fresh'),
    'fix:lint': () => run('lint', '--fix'),
    'report': () => 'c8 report --reporter=lcov',
    'watcher': () => 'nodemon -w test -w lib --exec',
    'watch:test': async () => [env, await run('watcher', await cutEnv('test'))],
    'watch:lint': async () => await run('watcher', `'npm run lint'`),
    'watch:tape': () => 'nodemon -w test -w lib --exec tape',
    'prewisdom': () => run(['lint', 'test']),
};
