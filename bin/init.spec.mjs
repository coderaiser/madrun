'use strict';

import {test, stub} from 'supertape';
import {createMockImport} from 'mock-import';

const {mockImport, reImport} = createMockImport(import.meta.url);

test('madrun: init: createMadrun', async (t) => {
    const access = stub();

    mockImport('fs/promises', {
        access,
    })
    
    const {createMadrun} = await reImport('./init.mjs');
    const cwd = '/hello'
    const name = await createMadrun(cwd);

    t.equal(name, '/hello/.madrun.js');
    t.end();
})