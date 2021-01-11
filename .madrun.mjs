import {run} from './lib/madrun.js';

const SUPERTAPE_PROGRESS_BAR_MIN = 20;
const env = {
    SUPERTAPE_PROGRESS_BAR_MIN,
};

export default {
    'lint': () => 'putout .',
    'fresh:lint': () => run('lint', '--fresh'),
    'lint:fresh': () => run('lint', '--fresh'),
    'fix:lint': () => run('lint', '--fix'),
    'test:base': () => `tape 'test/**/*.js' '{lib,bin}/**/*.spec.{js,mjs}'`,
    'test': async () => await run('test:base', '', env),
    'watch:test': async () => await run('watcher', await run('test')),
    'watch:tape': () => 'nodemon -w test -w lib --exec tape',
    'watch:lint': async () => await run('watcher', await run('lint')),
    'watcher': () => 'nodemon -w test -w lib -w bin --exec',
    'coverage:base': async () => `nyc ${await run('test:base')}`,
    'coverage': async () => await run('coverage:base', '', env),
    'report': () => 'nyc report --reporter=text-lcov | coveralls',
    'postpublish': () => 'npm i -g',
    'hello': () => {},
};

