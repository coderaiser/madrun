'use strict';

const test = require('supertape');
const check = require('../lib/check');

const noop = () => {};

test('madrun: check', (t) => {
    const result = check({
        test: 'hello',
        lint: 'lint',
        coverage: noop,
    });
    
    const expected = `echo 'fix scripts first: "test", "lint"'`;
    
    t.equal(result, expected);
    t.end();
});

