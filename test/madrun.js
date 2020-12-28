'use strict';

const test = require('supertape');
const tryToCatch = require('try-to-catch');
const stub = require('@cloudcmd/stub');
const mockRequire = require('mock-require');

const {reRequire, stopAll} = mockRequire;

const {
    run,
    series,
    parallel,
} = require('..');

test('madrun: run', async (t) => {
    const lint = 'eslint lib';
    const env = {};
    const scripts = {
        lint: () => lint,
    };
    
    const result = await run('lint', '', env, scripts);
    
    t.equal(result, lint, 'should equal');
    t.end();
});

test('madrun: run: series', async (t) => {
    const lint = 'eslint lib';
    const env = {};
    const scripts = {
        lint: () => lint,
    };
    
    const result = await run(['lint'], '', env, scripts);
    
    t.equal(result, lint, 'should equal');
    t.end();
});

test('madrun: run: series: no options', async (t) => {
    const lint = 'putout .';
    
    const result = await series(['lint']);
    
    t.equal(result, lint, 'should equal');
    t.end();
});

test('madrun: run: parallel: no scripts', async (t) => {
    const lint = 'putout .';
    const env = {};
    
    const result = await parallel(['lint'], '', env);
    
    t.equal(result, lint, 'should equal');
    t.end();
});

test('madrun: run: parallel: no options', async (t) => {
    const lint = 'putout .';
    
    const result = await parallel(['lint']);
    
    t.equal(result, lint, 'should equal');
    t.end();
});

test('madrun: run: not found', async (t) => {
    const scripts = {};
    const env = {};
    
    const [e] = await tryToCatch(run, 'test', '', env, scripts);
    const expected = 'one of scripts not found: test';
    
    t.equal(e.message, expected, 'should equal');
    t.end();
});

test('madrun: run: problem script', async (t) => {
    const env = {};
    const scripts = {
        hello: 'world',
    };
    
    const [, data] = await tryToCatch(run, 'test', '', env, scripts);
    const expected = `echo 'fix scripts first: "hello"'`;
    
    t.equal(data, expected, 'should equal');
    t.end();
});

test('madrun: run: not found: no scripts provided', async (t) => {
    const [e] = await tryToCatch(run, 'abc', '');
    const expected = 'one of scripts not found: abc';
    
    t.equal(e.message, expected, 'should equal');
    t.end();
});

test('madrun: run: not found: deep', async (t) => {
    const env = {};
    const scripts = {
        lint: () => run('test', '', env, scripts),
    };
    
    const [e] = await tryToCatch(run, 'lint', '', env, scripts);
    const expected = 'one of scripts not found: test';
    
    t.equal(e.message, expected, 'should equal');
    t.end();
});

test('madrun: series: opts', async (t) => {
    const env = {};
    const scripts = {
        'lint:lib': () => 'eslint lib',
        'lint:bin': () => 'eslint bin',
    };
    
    const result = await run(['lint:lib', 'lint:bin'], '--fix', env, scripts);
    const expected = 'eslint lib --fix && eslint bin --fix';
    
    t.equal(result, expected, 'should equal');
    t.end();
});

test('madrun: series: one arg', async (t) => {
    const env = {};
    const scripts = {
        'lint:lib': () => 'eslint lib',
        'lint:bin': () => 'eslint bin',
    };
    
    const result = await run('lint:*', '', env, scripts);
    const expected = 'eslint lib && eslint bin';
    
    t.equal(result, expected, 'should equal');
    t.end();
});

test('madrun: parallel', async (t) => {
    const env = {};
    const scripts = {
        'lint:lib': () => 'eslint lib',
        'lint:bin': () => 'eslint bin',
    };
    
    const result = await parallel('lint:*', '', env, scripts);
    const expected = 'eslint lib & eslint bin';
    
    t.equal(result, expected, 'should equal');
    t.end();
});

test('madrun: parallel: env', async (t) => {
    const scripts = {
        'lint:lib': () => 'eslint lib',
        'lint:bin': () => 'eslint bin',
    };
    
    const env = {
        NODE_ENV: 'development',
    };
    
    const result = await parallel('lint:*', '', env, scripts);
    const expected = 'NODE_ENV=development eslint lib & NODE_ENV=development eslint bin';
    
    t.equal(result, expected, 'should equal');
    t.end();
});

test('madrun: pre, post', async (t) => {
    const env = {};
    const scripts = {
        prelint: () => 'echo pre',
        lint: () => 'eslint lib',
        postlint: () => 'echo post',
    };
    
    const result = await run('lint', '', env, scripts);
    const expected = 'echo pre && eslint lib && echo post';
    
    t.equal(result, expected, 'should equal');
    t.end();
});

test('madrun: run: .madrun.js not found', async (t) => {
    mockRequire('find-up', {
        sync: stub(),
    });
    const {run} = reRequire('..');
    const [e] = await tryToCatch(run);
    
    stopAll();
    
    t.equal(e.message, '.madrun.js is missing!');
    t.end();
});

