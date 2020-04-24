'use strict';

import {run} from './lib/madrun.js';

export default {
    'lint': () => 'putout bin lib test .madrun.mjs',
    'fix:lint': () => run('lint', '--fix'),
    'test': () => `tape 'test/**/*.js' 'lib/**/*.spec.js' 'lib/**/*.spec.mjs'`,
    'watch:test': () => run('watcher', run('test')),
    'watch:tape': () => 'nodemon -w test -w lib --exec tape',
    'watch:coverage:base': () => run('watcher', `nyc ${run('test')}`),
    'watch:coverage:tape': () => run('watcher', 'nyc tape'),
    'watch:coverage': () => run('watch:coverage:base'),
    'watch:lint': () => run('watcher', run('lint')),
    'watcher': () => 'nodemon -w test -w lib --exec',
    'coverage': () => `nyc ${run('test')}`,
    'report': () => 'nyc report --reporter=text-lcov | coveralls',
    'postpublish': () => 'npm i -g',
};

