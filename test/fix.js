import test from 'supertape';
import jsonFormatter from '@putout/formatter-json';
import {runPutout} from '../lib/fix.js';
import fixture from './fixture/fix.json' with {
    type: 'json',
};

test('madrun: fix: fixture', async (t) => {
    const options = {
        fixCount: 1,
    };
    
    const source = `
        module.exports = {
            'hello': 'world'
        };
    `;
    
    const result = await runPutout(source, options, {
        formatterDump: jsonFormatter,
    });
    
    t.deepEqual(result, fixture);
    t.end();
});
