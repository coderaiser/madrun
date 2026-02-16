import {defineEnv} from 'supertape/env';
import {run, cutEnv} from './lib/madrun.js';

const noop = () => {};

const env = defineEnv({
    progressBarMin: 20,
});

export default {
    'lint': () => 'putout .',
    'fresh:lint': () => run('lint', '--fresh'),
    'lint:fresh': () => run('lint', '--fresh'),
    'fix:lint': () => run('lint', '--fix'),
    'test:only': () => `tape 'test/**/*.js' '{lib,bin}/**/*.spec.{js,mjs}'`,
    'test': async () => [env, await run('test:only')],
    'watch:test': async () => await run('watcher', await cutEnv('test')),
    'watch:tape': () => 'nodemon -w test -w lib --exec tape',
    'watch:lint': async () => await run('watcher', await run('lint')),
    'watcher': () => 'nodemon -w test -w lib -w bin --exec',
    'coverage': async () => [`c8 ${await run('test:only')}`, env],
    'report': () => 'c8 report --reporter=lcov',
    'postpublish': () => 'npm i -g',
    'hello': noop,
    'prepare': () => 'echo "> prepare"',
};
