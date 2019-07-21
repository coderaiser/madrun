'use strict';

const {
    run,
    predefined,
} = require('.');

const {eslint} = predefined;

module.exports = {
    'lint': () => {
        const names = [
            'bin',
            'lib',
            'test',
            '.eslintrc.js',
            'madrun.js',
        ];
        
        return eslint({names});
    },
    'fix:lint': () => {
        return run('lint', '--fix');
    },
    'test': () => 'tape test/**/*.js',
    'watch:test': () => run('watcher', run('test')),
    'watch:tape': () => 'nodemon -w test -w lib --exec tape',
    'watch:coverage:base': () => run('watcher', `nyc ${run('test')}`),
    'watch:coverage:tape': () => run(['watcher'], 'nyc tape'),
    'watch:coverage': () => run('watch:coverage:base'),
    'watch:lint': () => run('watcher', run('lint')),
    'watcher': () => 'nodemon -w test -w lib --exec',
    'coverage': () => `nyc ${run('test')}`,
    'report': () => 'nyc report --reporter=text-lcov | coveralls',
    'postpublish': () => 'npm i -g',
};

