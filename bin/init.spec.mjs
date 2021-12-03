import {join} from 'path';

import {
    test,
    stub,
} from 'supertape';

import montag from 'montag';
import tryToCatch from 'try-to-catch';
import {createCommons} from 'simport';
import {createMockImport} from 'mock-import';

const {__dirname} = createCommons(import.meta.url);
const {
    mockImport,
    reImport,
    stopAll,
} = createMockImport(import.meta.url);

const {stringify} = JSON;

test('madrun: init: createMadrun: found', async (t) => {
    const access = stub();
    
    mockImport('fs/promises', {
        access,
    });
    
    const {createMadrun} = await reImport('./init.mjs');
    const cwd = '/hello';
    const name = await createMadrun(cwd);
    
    stopAll();
    
    t.equal(name, '/hello/.madrun.js');
    t.end();
});

test('madrun: init: createMadrun: writeFile', async (t) => {
    const access = stub().throws(Error('xxx'));
    const writeFile = stub();
    
    mockImport('fs/promises', {
        access,
        writeFile,
    });
    
    const {createMadrun} = await reImport('./init.mjs');
    const cwd = '/hello';
    
    await createMadrun(cwd, {
        scripts: {
            x: 'hello',
        },
    });
    
    const code = montag`
        'use strict';
        
        const {
            run,
            series,
            parallel,
        } = require('madrun');
        
        module.exports = {
        \"x\": \"hello\"
        };
    `;
    
    const expected = [
        '/hello/.madrun.js',
        code,
    ];
    
    stopAll();
    
    t.calledWith(writeFile, expected);
    t.end();
});

test('madrun: init: createMadrun: writeFile: no scripts', async (t) => {
    const access = stub().throws(Error('xxx'));
    const writeFile = stub();
    
    mockImport('fs/promises', {
        access,
        writeFile,
    });
    
    const {createMadrun} = await reImport('./init.mjs');
    const cwd = '/hello';
    
    await createMadrun(cwd, {});
    
    const code = montag`
        'use strict';
        
        const {
            run,
            series,
            parallel,
        } = require('madrun');
        
        module.exports = {};
    `;
    
    const expected = [
        '/hello/.madrun.js',
        code,
    ];
    
    stopAll();
    
    t.calledWith(writeFile, expected);
    t.end();
});

test('madrun: init: patchPackage: import error', async (t) => {
    const {patchPackage} = await reImport('./init.mjs');
    const [error] = await tryToCatch(patchPackage, 'xxx');
    
    t.match(error.message, RegExp(`Cannot find package 'xxx'`));
    t.end();
});

test('madrun: init: patchPackage: import error: writeFile', async (t) => {
    const writeFile = stub();
    const madrunFile = join(__dirname, 'fixture', 'madrun.mjs');
    
    mockImport('fs/promises', {
        writeFile,
    });
    
    const {patchPackage} = await reImport('./init.mjs');
    await patchPackage(madrunFile, {
        hello: 'world',
    });
    
    const content = stringify({
        hello: 'world',
        scripts: {
            test: 'madrun test',
            pretest: 'madrun pretest',
        },
    }, null, 2) + '\n';
    
    stopAll();
    
    const expected = [
        './package.json',
        content,
    ];
    
    t.calledWith(writeFile, expected);
    t.end();
});

