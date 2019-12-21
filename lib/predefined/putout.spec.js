'use strict';

const test = require('supertape');
const {putout} = require('.');

test('madrun: putout', (t) => {
    const names = ['a'];
    const result = putout({
        names,
    });
    
    const expected = `putout a`;
    
    t.equal(result, expected);
    t.end();
});

test('madrun: putout: formatter', (t) => {
    const result = putout({
        names: ['abc'],
        formatter: 'stream',
    });
    
    const expected = `putout abc -f stream`;
    
    t.equal(result, expected);
    t.end();
});

test('madrun: putout: args: array', (t) => {
    const names = ['a'];
    const result = putout(names);
    
    const expected = `putout a`;
    
    t.equal(result, expected);
    t.end();
});

test('madrun: putout: no args', (t) => {
    const result = putout();
    const expected = `putout `;
    
    t.equal(result, expected);
    t.end();
});

test('madrun: putout: no args: rules', (t) => {
    const rulesdir = 'rules';
    const result = putout({rulesdir});
    const expected = `putout --rulesdir rules`;
    
    t.equal(result, expected);
    t.end();
});

test('madrun: putout: no args: formatter', (t) => {
    const result = putout({
        formatter: 'stream',
    });
    
    const expected = `putout -f stream`;
    
    t.equal(result, expected);
    t.end();
});

