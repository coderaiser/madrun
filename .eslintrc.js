'use strict';

module.exports = {
    parserOptions: {
        sourceType: 'script',
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
