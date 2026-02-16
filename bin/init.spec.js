import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {test, stub} from 'supertape';
import montag from 'montag';
import {tryToCatch} from 'try-to-catch';
import {createMadrun, patchPackage} from './init.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const {stringify} = JSON;

test('madrun: init: createMadrun: found', async (t) => {
    const access = stub();
    const cwd = '/hello';
    const name = await createMadrun(cwd, null, {
        access,
    });
    
    t.equal(name, '/hello/.madrun.js');
    t.end();
});

test('madrun: init: createMadrun: writeFile', async (t) => {
    const access = stub().throws(Error('xxx'));
    const writeFile = stub();
    
    const cwd = '/hello';
    const info = {
        scripts: {
            x: 'hello',
        },
    };
    
    await createMadrun(cwd, info, {
        writeFile,
        access,
    });
    
    const code = montag`
        'use strict';
        
        const {
            run,
            series,
            parallel,
        } = require('madrun');
        
        module.exports = {
        "x": "hello"
        };
    `;
    
    const expected = ['/hello/.madrun.js', code];
    
    t.calledWith(writeFile, expected);
    t.end();
});

test('madrun: init: createMadrun: writeFile: no scripts', async (t) => {
    const access = stub().throws(Error('xxx'));
    const writeFile = stub();
    
    const cwd = '/hello';
    
    await createMadrun(cwd, {}, {
        access,
        writeFile,
    });
    
    const code = montag`
        'use strict';
        
        const {
            run,
            series,
            parallel,
        } = require('madrun');
        
        module.exports = {};
    `;
    
    const expected = ['/hello/.madrun.js', code];
    
    t.calledWith(writeFile, expected);
    t.end();
});

test('madrun: init: patchPackage: import error', async (t) => {
    const [error] = await tryToCatch(patchPackage, 'xxx');
    
    t.match(error.message, RegExp(`Cannot find package 'xxx'`));
    t.end();
});

test('madrun: init: patchPackage: import error: writeFile', async (t) => {
    const writeFile = stub();
    const madrunFile = join(__dirname, 'fixture', 'madrun.mjs');
    const info = {
        hello: 'world',
    };
    
    await patchPackage(madrunFile, info, {
        writeFile,
    });
    
    const content = stringify({
        hello: 'world',
        scripts: {
            test: 'madrun test',
        },
    }, null, 2) + '\n';
    
    const expected = ['./package.json', content];
    
    t.calledWith(writeFile, expected);
    t.end();
});

test('madrun: init: patchPackage: avoid pre', async (t) => {
    const writeFile = stub();
    const madrunFile = join(__dirname, 'fixture', 'madrun.mjs');
    
    const info = {
        hello: 'world',
    };
    
    await patchPackage(madrunFile, info, {
        writeFile,
    });
    
    const content = stringify({
        hello: 'world',
        scripts: {
            test: 'madrun test',
        },
    }, null, 2) + '\n';
    
    const expected = ['./package.json', content];
    
    t.calledWith(writeFile, expected);
    t.end();
});

test('madrun: init: patchPackage: avoid post', async (t) => {
    const writeFile = stub();
    const madrunFile = join(__dirname, 'fixture', 'madrun.mjs');
    const info = {
        hello: 'world',
    };
    
    await patchPackage(madrunFile, info, {
        writeFile,
    });
    
    const content = stringify({
        hello: 'world',
        scripts: {
            test: 'madrun test',
        },
    }, null, 2) + '\n';
    
    const expected = ['./package.json', content];
    
    t.calledWith(writeFile, expected);
    t.end();
});
