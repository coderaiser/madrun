import {test} from 'supertape';
import check from '../lib/check.js';

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
