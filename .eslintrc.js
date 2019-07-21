'use strict';

module.exports = {
    parserOptions: {
        sourceType: 'script',
    },
    rules: {
        'putout/putout': ['error', require('./.putout.json')],
    },
    overrides: [{
        files: ['bin/*.js'],
        rules: {
            'no-console': 0,
            'no-process-exit': 0,
        },
    }],
    extends: [
        'plugin:node/recommended',
        'plugin:putout/recommended',
    ],
    plugins: [
        'putout',
        'node',
    ],
};
