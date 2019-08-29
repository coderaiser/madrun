'use strict';

const test = require('supertape');
const tryCatch = require('try-catch');

const {
    run,
    parallel,
} = require('..');

test('madrun: run', (t) => {
    const lint = 'eslint lib';
    const env = {};
    const scripts = {
        lint: () => lint,
    };
    
    const result = run('lint', '', env, scripts);
    
    t.equal(result, lint, 'should equal');
    t.end();
});

test('madrun: run: series', (t) => {
    const lint = 'eslint lib';
    const env = {};
    const scripts = {
        lint: () => lint,
    };
    
    const result = run(['lint'], '', env, scripts);
    
    t.equal(result, lint, 'should equal');
    t.end();
});

test('madrun: run: not found', (t) => {
    const scripts = {};
    const env = {};
    
    const [e] = tryCatch(run, 'test', '', env, scripts);
    const expected = 'one of scripts not found: test';
    
    t.equal(e.message, expected, 'should equal');
    t.end();
});

test('madrun: run: problem script', (t) => {
    const env = {};
    const scripts = {
        hello: 'world',
    };
    
    const [, data] = tryCatch(run, 'test', '', env, scripts);
    const expected = `echo 'fix scripts first: "hello"'`;
    
    t.equal(data, expected, 'should equal');
    t.end();
});

test('madrun: run: not found: no scripts provided', (t) => {
    const [e] = tryCatch(run, 'abc', '');
    const expected = 'one of scripts not found: abc';
    
    t.equal(e.message, expected, 'should equal');
    t.end();
});

test('madrun: run: not found: deep', (t) => {
    const env = {};
    const scripts = {
        lint: () => run('test', '', env, scripts),
    };
    
    const [e] = tryCatch(run, 'lint', '', env, scripts);
    const expected = 'one of scripts not found: test';
    
    t.equal(e.message, expected, 'should equal');
    t.end();
});

test('madrun: series: opts', (t) => {
    const env = {};
    const scripts = {
        'lint:lib': () => 'eslint lib',
        'lint:bin': () => 'eslint bin',
    };
    
    const result = run(['lint:lib', 'lint:bin'], '--fix', env, scripts);
    const expected = 'eslint lib --fix && eslint bin --fix';
    
    t.equal(result, expected, 'should equal');
    t.end();
});

test('madrun: series: one arg', (t) => {
    const env = {};
    const scripts = {
        'lint:lib': () => 'eslint lib',
        'lint:bin': () => 'eslint bin',
    };
    
    const result = run('lint:*', '', env, scripts);
    const expected = 'eslint lib && eslint bin';
    
    t.equal(result, expected, 'should equal');
    t.end();
});

test('madrun: parallel', (t) => {
    const env = {};
    const scripts = {
        'lint:lib': () => 'eslint lib',
        'lint:bin': () => 'eslint bin',
    };
    
    const result = parallel('lint:*', '', env, scripts);
    const expected = 'eslint lib & eslint bin';
    
    t.equal(result, expected, 'should equal');
    t.end();
});

test('madrun: parallel: env', (t) => {
    const scripts = {
        'lint:lib': () => 'eslint lib',
        'lint:bin': () => 'eslint bin',
    };
    
    const env = {
        NODE_ENV: 'development',
    };
    
    const result = parallel('lint:*', '', env, scripts);
    const expected = 'NODE_ENV=development eslint lib & NODE_ENV=development eslint bin';
    
    t.equal(result, expected, 'should equal');
    t.end();
});

test('madrun: pre, post', (t) => {
    const env = {};
    const scripts = {
        prelint: () => 'echo pre',
        lint: () => 'eslint lib',
        postlint: () => 'echo post',
    };
    
    const result = run('lint', '', env, scripts);
    const expected = 'echo pre && eslint lib && echo post';
    
    t.equal(result, expected, 'should equal');
    t.end();
});

