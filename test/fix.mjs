import test from 'supertape';
import {createMockImport} from 'mock-import';
import jsonFormatter from '@putout/formatter-json';

const {
    mockImport,
    reImport,
    stopAll,
} = createMockImport(import.meta.url);

test('madrun: fix', async (t) => {
    const fixture = await import('./fixture/fix.json');
    const options = {
        fixCount: 1,
    };
    
    mockImport('@putout/formatter-dump', jsonFormatter);
    
    const {runPutout} = await reImport('../lib/fix.mjs');
    const result = runPutout(`
        module.exports = {
            'hello': 'world'
        };
    `, options);
    
    stopAll();
    
    t.deepEqual(result, fixture, 'should equal');
    t.end();
});

