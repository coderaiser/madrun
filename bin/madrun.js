#!/usr/bin/env node

'use strict';

const {
    dirname
} = require('path');

const findUp = require('find-up');

const {series} = require('..');

const {
    exit
} = process;

const args = require('yargs-parser')(process.argv.slice(2), {
    configuration: {
        'populate--': true,
    },
});

const names = args._;
const options = getOptions(args['--']);
const [dir, script] = getScript();

if (!names.length) {
    console.log(Object.keys(script).join('\n'));
    exit();
}

const cmd = series(names, options, script);

console.log(`> ${cmd}`);

execute(cmd);

function execute(cmd) {
    const execSync = require('child_process').execSync;
    const tryCatch = require('try-catch');
    
    const [e] = tryCatch(execSync, cmd, {
        stdio: [0, 1, 2, 'pipe'],
        cwd: dir,
    });
    
    if (e) {
        console.error(e.message);
        process.exit(1);
    }
}

function getOptions(args) {
    if (!args)
        return '';
    
    return args.join(' ');
}

function getScript() {
    const path = findUp.sync('.madrun.js');
    
    if (!path) {
        console.error('file ".madrun.js" not found!');
        process.exit(1);
    }
    
    return [
        dirname(path),
        require(path),
    ];
}

