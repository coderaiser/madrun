'use strict';

const {join} = require('path');

const {
    test,
    stub,
} = require('supertape');

const montag = require('montag');
const mockRequire = require('mock-require');
const tryToCatch = require('try-to-catch');

const {reRequire} = mockRequire;
const {stringify} = JSON;

test('madrun: init: createMadrun: found', async (t) => {
    const access = stub();
    
    mockRequire('fs/promises', {
        access,
    });
    
    const {createMadrun} = await reRequire('./init');
    const cwd = '/hello';
    const name = await createMadrun(cwd);
    
    t.equal(name, '/hello/.madrun.js');
    t.end();
});

test('madrun: init: createMadrun: writeFile', async (t) => {
    const access = stub().throws(Error('xxx'));
    const writeFile = stub();
    
    mockRequire('fs/promises', {
        access,
        writeFile,
    });
    
    const {createMadrun} = await reRequire('./init');
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
        
        module.exports = {\"x\":\"hello\"};
    `;
    
    const expected = [
        '/hello/.madrun.js',
        code,
    ];
    
    t.calledWith(writeFile, expected);
    t.end();
});

test('madrun: init: createMadrun: writeFile: no scripts', async (t) => {
    const access = stub().throws(Error('xxx'));
    const writeFile = stub();
    
    mockRequire('fs/promises', {
        access,
        writeFile,
    });
    
    const {createMadrun} = await reRequire('./init');
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
    
    t.calledWith(writeFile, expected);
    t.end();
});

test('madrun: init: patchPackage: import error', async (t) => {
    const {patchPackage} = await reRequire('./init');
    const [error] = await tryToCatch(patchPackage, 'xxx');
    
    t.ok(error.message.includes(`Cannot find package 'xxx'`));
    t.end();
});

test('madrun: init: patchPackage: import error', async (t) => {
    const writeFile = stub();
    const madrunFile = join(__dirname, 'fixture', 'madrun.mjs');
    
    mockRequire('fs/promises', {
        writeFile,
    });
    
    const {patchPackage} = await reRequire('./init');
    await patchPackage(madrunFile, {
        hello: 'world',
    });
    
    const content = stringify({
        hello: 'world',
        scripts: {
            test: 'madrun test',
        },
    }, null, 2) + '\n';
    
    const expected = [
        './package.json',
        content,
    ];
    
    t.calledWith(writeFile, expected);
    t.end();
});

