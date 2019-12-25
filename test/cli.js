'use strict';

const {join} = require('path');
const {execSync} = require('child_process');

const test = require('supertape');
const tryCatch = require('try-catch');

const {version} = require('../package');
const help = require('../lib/help');

const cliPath = join(__dirname, '../bin/madrun.js');

test('madrun: cli: -v', async (t) => {
    const result = runsome(cliPath, '-v');
    const expected = `v${version}`;
    
    t.equal(result, expected);
    t.end();
});

test('madrun: cli: --version', async (t) => {
    const result = runsome(cliPath, '--version');
    const expected = `v${version}`;
    
    t.equal(result, expected);
    t.end();
});

test('madrun: cli: --help', async (t) => {
    const result = runsome(cliPath, '--help');
    const expected = help();
    
    t.equal(result, expected);
    t.end();
});

test('madrun: cli: -h', (t) => {
    const result = runsome(cliPath, '--h');
    const expected = help();
    
    t.equal(result, expected);
    t.end();
});

test('madrun: cli: script not found', (t) => {
    const result = runsome(cliPath, 'xxx');
    const expected = 'one of scripts not found: xxx';
    
    t.equal(result, expected);
    t.end();
});

test('madrun: cli: kill', async (t) => {
    const result = runsome(cliPath, 'lint', {
        timeout: 1000,
    });
    
    const expected = '> putout bin lib test .madrun.js';
    
    t.equal(result, expected);
    t.end();
});

const rmNewLine = (a) => a.toString().replace(/\n$/, '');

function runsome(name, args, options = {}) {
    const {
        timeout = 0,
    } = options;
    
    const [e, result] = tryCatch(execSync, `${name} ${args}`, {
        timeout,
    });
    
    if (e) {
        return rmNewLine(e.stdout) || rmNewLine(e.stderr);
    }
    
    return rmNewLine(result);
}

