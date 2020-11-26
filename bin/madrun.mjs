#!/usr/bin/env node

'use strict';

import {dirname, basename} from 'path';

import findUp from 'find-up';
import tryCatch from 'try-catch';
import yargsParser from 'yargs-parser';

import {series} from '../lib/madrun.js';
import check from '../lib/check.js';

const {exit} = process;
const {
    MADRUN_PWD,
    MADRUN_NAME,
} = process.env;
const cwd = process.cwd();

const args = yargsParser(process.argv.slice(2), {
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
    const {help} = await import('../lib/help.js');
    console.log(help());
    process.exit();
}

if (version) {
    const {version} = await readJSON('../package.json');
    console.log(`v${version}`);
    process.exit();
}

if (init) {
    const {
        create,
        patchNpmIgnore,
        patchPackage,
    } = await import('./init');
    fix = true;
    
    create();
    patchNpmIgnore();
    patchPackage();
}

const names = args._;
const options = getOptions(args['--']);
const [dir, script] = await getScript();

const problems = check(script);

if (problems) {
    const result = await putoutMadrun(dir, {fix});
    
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

console.log(getOutput({cmd, cwd}));
execute(cmd);

function getOutput({cmd, cwd}) {
    if (MADRUN_PWD)
        return `> ${cmd} (${cwd})`;
    
    if (MADRUN_NAME)
        return `> ${cmd} (${basename(cwd)})`;
    
    return `> ${cmd}`;
}

function execute(cmd) {
    const {execSync} = import('child_process');
    const tryCatch = import('try-catch');
    
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

async function getScript() {
    const path = findUp.sync([
        '.madrun.js',
        '.madrun.cjs',
    ]);
    
    if (!path) {
        console.error('file ".madrun.js" not found!');
        process.exit(1);
    }
    
    const esm = await import(path);
    
    return [
        dirname(path),
        esm.default,
    ];
}

async function putoutMadrun(dir, {fix}) {
    const name = `${dir}/.madrun.js`;
    const {runPutout} = import('../lib/fix.js');
    const {
        readFile,
        writeFile,
    } = import('fs/promises');
    
    const data = await readFile(name, 'utf8');
    const {places, code} = runPutout(data);
    
    if (fix)
        await writeFile(name, code);
    
    return places;
}

async function readJSON(name) {
    const {readFile} = await import('fs/promises');
    const {parse} = JSON;
    const src = new URL(name, import.meta.url);
    const info = await readFile(src, 'utf8');
    
    return parse(info);
}
