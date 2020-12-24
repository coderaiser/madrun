import {run} from './lib/madrun.js';

const NODE_OPTIONS = `'--no-warnings --loader mock-import'`;
const C8_OPTIONS = [
    '--exclude="**/test/**"',
    '--exclude "**/{bin,lib}/**/*.spec.{js,mjs}"',
    '--check-coverage --lines 100 --functions 100 --branches 100',
].join(' ');

export default {
    'lint': () => 'putout .',
    'fix:lint': () => run('lint', '--fix'),
    'test:base': () => `tape 'test/**/*.js' '{lib,bin}/**/*.spec.{js,mjs}'`,
    'test': async () => await run('test:base', '', {
        NODE_OPTIONS,
    }),
    'watch:test': async () => await run('watcher', await run('test')),
    'watch:tape': () => 'nodemon -w test -w lib --exec tape',
    'watch:lint': () => run('watcher', run('lint')),
    'watcher': () => 'nodemon -w test -w lib --exec',
    'coverage:base': async () => `c8 ${C8_OPTIONS} ${await run('test:base')}`,
    'coverage': async () => await run('coverage:base', '', {
        NODE_OPTIONS,
    }),
    'report': () => 'nyc report --reporter=text-lcov | coveralls',
    'postpublish': () => 'npm i -g',
    'hello': () => console.log('hello'),
};

