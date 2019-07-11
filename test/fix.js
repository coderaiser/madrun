'use strict';

const test = require('supertape');
const fix = require('../lib/fix');
const fixture = require('./fixture/fix');

test('madrun: fix', (t) => {
    const options = {
        fixCount: 1,
    };
    
    const result = fix(`
        module.exports = {
            'hello': 'world'
        };
    `, options);
    
    t.deepEqual(result, fixture, 'should equal');
    t.end();
});

