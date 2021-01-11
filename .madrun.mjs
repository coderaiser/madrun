import {run, cutEnv} from './lib/madrun.js';

const env = {
    SUPERTAPE_PROGRESS_BAR_MIN: 20,
};

export default {
    'lint': () => 'putout .',
    'fresh:lint': () => run('lint', '--fresh'),
    'lint:fresh': () => run('lint', '--fresh'),
    'fix:lint': () => run('lint', '--fix'),
    'test': () => [`tape 'test/**/*.js' '{lib,bin}/**/*.spec.{js,mjs}'`, env],
    'watch:test': async () => await run('watcher', await run('test')),
    'watch:tape': () => 'nodemon -w test -w lib --exec tape',
    'watch:lint': async () => await run('watcher', await run('lint')),
    'watcher': () => 'nodemon -w test -w lib -w bin --exec',
    'coverage': async () => [`nyc ${await cutEnv('test')}`, env],
    'report': () => 'nyc report --reporter=text-lcov | coveralls',
    'postpublish': () => 'npm i -g',
    'hello': () => {},
};

