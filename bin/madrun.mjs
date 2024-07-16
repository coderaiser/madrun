#!/usr/bin/env node

import {createRequire} from 'node:module';
import {dirname, basename} from 'node:path';
import process from 'node:process';
import findUp from 'find-up';
import tryToCatch from 'try-to-catch';
import yargsParser from 'yargs-parser';
import {series} from '../lib/madrun.js';
import check from '../lib/check.js';
import {choose} from '../lib/choose.mjs';

const require = createRequire(import.meta.url);

const {exit} = process;

const {MADRUN_PWD, MADRUN_NAME} = process.env;

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
    const {help} = require('../lib/help.js');
    console.log(help());
    exit();
}

if (version) {
    const {version} = require('../package.json');
    console.log(`v${version}`);
    exit();
}

if (init) {
    const {createMadrun, patchPackage} = await import('./init.mjs');
    
    fix = true;
    
    const [errorPackage, info] = await tryToCatch(require, `${cwd}/package.json`);
    
    if (errorPackage)
        console.error(errorPackage);
    
    const name = await createMadrun(cwd, info);
    const [error] = await tryToCatch(patchPackage, name, info);
    
    if (error)
        console.error(error);
}

let names = args._;
const options = getOptions(args['--']);
const [dir, scripts] = await getScript();

const problems = check(scripts);

if (problems) {
    const result = await putoutMadrun(dir, {
        fix,
    });
    
    if (fix) {
        exit();
    } else {
        console.log(result);
        exit(1);
    }
}

if (init)
    exit();

if (problems) {
    await execute(`echo '${problems}'`);
    exit(1);
}

if (!names.length)
    names = await choose(scripts);

if (!names.length)
    exit();

const env = {};
const [e, cmd] = await tryToCatch(series, names, options, env, scripts);

if (e) {
    console.error(e.message);
    exit(1);
}

console.log(getOutput({
    cmd,
    cwd,
}));
await execute(cmd);

function getOutput({cmd, cwd}) {
    if (MADRUN_PWD)
        return `> ${cmd} (${cwd})`;
    
    if (MADRUN_NAME)
        return `> ${cmd} (${basename(cwd)})`;
    
    return `> ${cmd}`;
}

async function execute(cmd) {
    const {execSync} = await import('node:child_process');
    const tryCatch = (await import('try-catch')).default;
    
    const [error] = tryCatch(execSync, cmd, {
        stdio: [0, 1, 2],
        cwd: dir,
    });
    
    if (error) {
        console.error(error.message);
        process.exit(1);
    }
}

function getOptions(args) {
    if (!args)
        return '';
    
    return args.join(' ');
}

async function getScript() {
    const {pathToFileURL} = require('node:url');
    const supported = require('../supported.json');
    const path = findUp.sync(supported);
    
    if (!path) {
        console.error('file ".madrun.js" not found!');
        process.exit(1);
    }
    
    // always convert path to url on windows
    const esm = await import(pathToFileURL(path));
    
    return [
        dirname(path),
        esm.default,
    ];
}

async function putoutMadrun(dir, {fix}) {
    const name = `${dir}/.madrun.js`;
    const {runPutout} = await import('../lib/fix.mjs');
    const {readFile, writeFile} = await import('node:fs/promises');
    const data = await readFile(name, 'utf8');
    const {places, code} = await runPutout(data);
    
    if (fix)
        await writeFile(name, code);
    
    return places;
}
