'use strict';

const test = require('supertape');
const fix = require('../lib/fix');
const fixture = require('./fixture/fix');

test('madrun: fix', (t) => {
    const result = fix(`
        module.exports = {
            'hello': 'world'
        };
    `);
    
    t.deepEqual(result, fixture, 'should equal');
    t.end();
});
