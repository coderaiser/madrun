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
    
    const expected = `eslint a --ignore-pattern 'b'`;
    
    t.equal(result, expected);
    t.end();
});

test('madrun: eslint: no args', (t) => {
    const result = eslint();
    const expected = `eslint`;
    
    t.equal(result, expected);
    t.end();
});

