import {
    run,
    cutEnv,
} from './lib/madrun.js';

const NODE_OPTIONS = `'--loader mock-import --no-warnings'`;

const env = {
    SUPERTAPE_PROGRESS_BAR_MIN: 20,
    NODE_OPTIONS,
};

export default {
    'lint': () => 'putout .',
    'fresh:lint': () => run('lint', '--fresh'),
    'lint:fresh': () => run('lint', '--fresh'),
    'fix:lint': () => run('lint', '--fix'),
    'test': () => [env, `tape 'test/**/*.js' '{lib,bin}/**/*.spec.{js,mjs}'`],
    'watch:test': async () => await run('watcher', await run('test')),
    'watch:tape': () => 'nodemon -w test -w lib --exec tape',
    'watch:lint': async () => await run('watcher', await run('lint')),
    'watcher': () => 'nodemon -w test -w lib -w bin --exec',
    'coverage': async () => [`c8 ${await cutEnv('test')}`, env],
    'report': () => 'c8 report --reporter=lcov',
    'postpublish': () => 'npm i -g',
    'hello': () => {},
};

