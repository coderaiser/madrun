#!/usr/bin/env node

'use strict';

const {dirname, basename} = require('path');

const findUp = require('find-up');
const tryCatch = require('try-catch');

const {series} = require('..');
const check = require('../lib/check');

const {exit} = process;
const {
    MADRUN_PWD,
    MADRUN_NAME,
} = process.env;
const cwd = process.cwd();

const args = require('yargs-parser')(process.argv.slice(2), {
    boolean: [
        'init',
        'fix',
        'help',
        'version',
    ],
    alias: {
        v: 'version',
        h: 'help',
    },
    configuration: {
        'populate--': true,
    },
});

let {fix} = args;

const {
    init,
    help,
    version,
} = args;

if (help) {
    const getHelpInfo = require('../lib/help');
    console.log(getHelpInfo());
    process.exit();
}

if (version) {
    console.log(`v${require('../package').version}`);
    process.exit();
}

if (init) {
    const init = require('./init');
    fix = true;
    
    init.create();
    init.patchNpmIgnore();
    init.patchPackage();
}

const names = args._;
const options = getOptions(args['--']);
const [dir, script] = getScript();

const problems = check(script);

if (problems) {
    const result = putoutMadrun(dir, {fix});
    
    if (fix) {
        process.exit();
    } else {
        console.log(result);
        process.exit(1);
    }
}

if (init)
    process.exit();

if (problems) {
    execute(`echo '${problems}'`);
    process.exit(1);
}

if (!names.length) {
    console.log(Object.keys(script).join('\n'));
    exit();
}

const env = {};
const [e, cmd] = tryCatch(series, names, options, env, script);

if (e) {
    console.error(e.message);
    process.exit(1);
}

console.log(getOutput(cmd));
execute(cmd);

function getOutput() {
    if (MADRUN_PWD)
        return `> ${cmd} (${cwd})`;
    
    if (MADRUN_NAME)
        return `> ${cmd} (${basename(cwd)})`;
    
    return `> ${cmd}`;
}

function execute(cmd) {
    const {execSync} = require('child_process');
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
    const path = findUp.sync([
        '.madrun.js',
        '.madrun.cjs',
    ]);
    
    if (!path) {
        console.error('file ".madrun.js" not found!');
        process.exit(1);
    }
    
    return [
        dirname(path),
        require(path),
    ];
}

function putoutMadrun(dir, {fix}) {
    const name = `${dir}/.madrun.js`;
    const putout = require('../lib/fix');
    const {
        readFileSync,
        writeFileSync,
    } = require('fs');
    
    const data = readFileSync(name, 'utf8');
    const {places, code} = putout(data);
    
    if (fix)
        writeFileSync(name, code);
    
    return places;
}

