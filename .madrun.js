import {run} from 'madrun';

const env = {
    ESCOVER_FORMAT: 'lines',
};

export default {
    'test': () => `bin/escover.js tape 'test/**/*.js' 'lib/**/*.spec.js' 'example/*.spec.js'`,
    'coverage': async () => [env, `c8 ${await run('test')}`],
    'lint': () => 'putout .',
    'fresh:lint': () => run('lint', '--fresh'),
    'lint:fresh': () => run('lint', '--fresh'),
    'fix:lint': () => run('lint', '--fix'),
    'report': () => 'c8 report --reporter=lcov',
    'watcher': () => 'nodemon -w test -w lib --exec',
    'watch:lint': async () => await run('watcher', `'npm run lint'`),
    'watch:tape': () => 'nodemon -w test -w lib --exec tape',
    'prewisdom': () => run(['lint', 'test']),
};

