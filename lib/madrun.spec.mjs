import test from 'supertape';
import {parallel} from './madrun.mjs';
import {readFileSync} from 'fs';

test.xxx = 'hello';
console.log(test);

process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.log('unhandledRejection', error.message);
});

test('madrun: mjs', (t) => {
    console.log('::::', parallel);
    
    const env = {};
    const scripts = {
        'lint:lib': () => 'eslint lib',
        'lint:bin': () => 'eslint bin',
    };
    
    const result = parallel('lint:*', '', env, scripts);
    const expected = 'eslint lib & eslint bin';
    
    t.equal(result, expected, 'should equal');
    t.end();
}).then(a => console.log(':::::', a))
.catch(console.error);
