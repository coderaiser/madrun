'use strict';

import test from 'supertape';
import {create} from './init.mjs';
import {createMockImport} from 'mock-import';

// const {mockImport, reImport} = createMockImport(import.meta);

// create();

// mockImport('./madrun.mjs', 'abc');
// const impl2 = await reImport('./init.mjs');
// create();

test('create: write file', (t) => {
    const expected = create();
    const recived = '.madrun.js';

    t.equal(expected, recived);
    t.end();
})