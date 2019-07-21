'use strict';

const test = require('supertape');
const {eslint} = require('..').predefined;

test('madrun: eslint', (t) => {
    const names = ['a'];
    const ignore = ['b'];
    const result = eslint({
        names,
        ignore,
    });
    
    const expected = `eslint a --ignore-pattern '!.eslintrc.js' --ignore-pattern 'b'`;
    
    t.equal(result, expected);
    t.end();
});

test('madrun: eslint: no args', (t) => {
    const result = eslint();
    const expected = `eslint  --ignore-pattern '!.eslintrc.js'`;
    
    t.equal(result, expected);
    t.end();
});

test('madrun: eslint: no args', (t) => {
    const rulesdir = 'rules';
    const result = eslint({rulesdir});
    const expected = `eslint --rulesdir rules --ignore-pattern '!.eslintrc.js'`;
    
    t.equal(result, expected);
    t.end();
});
