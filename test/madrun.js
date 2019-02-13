'use strict';

const test = require('supertape');
const tryCatch = require('try-catch');

const {
    run,
    series,
    parallel,
} = require('..');

test('madrun: run', (t) => {
    const lint = 'eslint lib';
    const scripts = {
        lint: () => lint,
    };
    
    const result = run('lint', '', scripts);
    
    t.equal(result, lint, 'should equal');
    t.end();
});

test('madrun: run: not found', (t) => {
    const scripts = {};
    
    const [e] = tryCatch(run, 'test', '', scripts);
    const expected = 'one of scripts not found: test';
    
    t.equal(e.message, expected, 'should equal');
    t.end();
});

test('madrun: run: problem script', (t) => {
    const scripts = {
        hello: 'world',
    };
    
    const [, data] = tryCatch(run, 'test', '', scripts);
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
    const scripts = {
        lint: () => run('test', '', scripts),
    };
    
    const [e] = tryCatch(run, 'lint', '', scripts);
    const expected = 'one of scripts not found: test';
    
    t.equal(e.message, expected, 'should equal');
    t.end();
});

test('madrun: series: opts', (t) => {
    const scripts = {
        'lint:lib': () => 'eslint lib',
        'lint:bin': () => 'eslint bin',
    };
    
    const result = series(['lint:lib', 'lint:bin'], '--fix', scripts);
    const expected = 'eslint lib --fix && eslint bin --fix';
    
    t.equal(result, expected, 'should equal');
    t.end();
});

test('madrun: series: one arg', (t) => {
    const scripts = {
        'lint:lib': () => 'eslint lib',
        'lint:bin': () => 'eslint bin',
    };
    
    const result = series('lint:*', '', scripts);
    const expected = 'eslint lib && eslint bin';
    
    t.equal(result, expected, 'should equal');
    t.end();
});

test('madrun: parallel', (t) => {
    const scripts = {
        'lint:lib': () => 'eslint lib',
        'lint:bin': () => 'eslint bin',
    };
    
    const result = parallel('lint:*', '', scripts);
    const expected = 'eslint lib & eslint bin';
    
    t.equal(result, expected, 'should equal');
    t.end();
});

test('madrun: pre, post', (t) => {
    const scripts = {
        'prelint': () => 'echo pre',
        'lint': () => 'eslint lib',
        'postlint': () => 'echo post',
    };
    
    const result = run('lint', '', scripts);
    const expected = 'echo pre && eslint lib && echo post';
    
    t.equal(result, expected, 'should equal');
    t.end();
});

