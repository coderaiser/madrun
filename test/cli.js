'use strict';

const {join} = require('path');

const test = require('supertape');
const runsome = require('runsome');

const {version} = require('../package');
const {help} = require('../lib/help');

const cliPath = join(__dirname, '../bin/madrun.mjs');
const run = runsome(cliPath);

test('madrun: cli: -v', (t) => {
    const result = run('-v');
    const expected = `v${version}`;
    
    t.equal(result, expected);
    t.end();
});

test('madrun: cli: --version', (t) => {
    const result = run('--version');
    const expected = `v${version}`;
    
    t.equal(result, expected);
    t.end();
});

test('madrun: cli: --help', (t) => {
    const result = run('--help');
    const expected = help();
    
    t.equal(result, expected);
    t.end();
});

test('madrun: cli: -h', (t) => {
    const result = run('--h');
    const expected = help();
    
    t.equal(result, expected);
    t.end();
});

test('madrun: cli: script not found', (t) => {
    const result = run('xxx');
    const expected = 'one of scripts not found: xxx';
    
    t.equal(result, expected);
    t.end();
});

test('madrun: cli: kill', (t) => {
    const result = run('lint', {
        timeout: 3000,
    });
    
    const expected = '> putout .';
    
    t.equal(result, expected);
    t.end();
});

