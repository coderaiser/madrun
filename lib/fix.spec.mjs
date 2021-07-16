import test from 'supertape';
import {runPutout} from './fix.mjs';

test('madrun: fix', (t) => {
    const result = runPutout('hello');
    const expected = {
        code: 'hello',
        places: '',
    };
    
    t.deepEqual(result, expected);
    t.end();
});

