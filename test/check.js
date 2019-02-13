'use strict';

const test = require('supertape');
const check = require('../lib/check');

test('madrun check', (t) => {
    const result = check({
        test: 'hello',
        lint: 'lint',
        coverage: () => {},
    });
    
    const expected = [
        'test',
        'lint',
    ];
    
    t.deepEqual(result, expected, 'should equal');
    t.end();
});

