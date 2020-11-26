'use strict';

const {run} = require('.');

module.exports = {
    'lint': () => 'putout .',
    'fix:lint': () => run('lint', '--fix'),
    'test': () => `tape 'test/**/*.js' 'lib/**/*.spec.js'`,
    'watch:test': async () => await run('watcher', await run('test')),
    'watch:tape': () => 'nodemon -w test -w lib --exec tape',
    'watch:coverage:base': async () => run('watcher', `nyc ${await run('test')}`),
    'watch:coverage:tape': () => run('watcher', 'nyc tape'),
    'watch:coverage': () => run('watch:coverage:base'),
    'watch:lint': () => run('watcher', run('lint')),
    'watcher': () => 'nodemon -w test -w lib --exec',
    'coverage': async () => `nyc ${await run('test')}`,
    'report': () => 'nyc report --reporter=text-lcov | coveralls',
    'postpublish': () => 'npm i -g',
};

