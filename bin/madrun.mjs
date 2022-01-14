#!/usr/bin/env node

import {createRequire} from 'module';
import {
    dirname,
    basename,
} from 'path';

import findUp from 'find-up';
import tryToCatch from 'try-to-catch';
import yargsParser from 'yargs-parser';

import {series} from '../lib/madrun.js';
import check from '../lib/check.js';
const require = createRequire(import.meta.url);

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
    const {help} = require('../lib/help.js');
    console.log(help());
    process.exit();
}

if (version) {
    const {version} = require('../package.json');
    console.log(`v${version}`);
    process.exit();
}

if (init) {
    const {
        createMadrun,
        patchPackage,
    } = await import('./init.mjs');
    
    fix = true;
    
    const [errorPackage, info] = await tryToCatch(require, `${cwd}/package.json`);
    
    if (errorPackage)
        console.error(errorPackage);
    
    const name = await createMadrun(cwd, info);
    const [error] = await tryToCatch(patchPackage, name, info);
    
    if (error)
        console.error(error);
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
    await execute(`echo '${problems}'`);
    process.exit(1);
}

if (!names.length) {
    console.log(Object.keys(script).join('\n'));
    exit();
}

const env = {};
const [e, cmd] = await tryToCatch(series, names, options, env, script);

if (e) {
    console.error(e.message);
    process.exit(1);
}

console.log(getOutput({cmd, cwd}));
await execute(cmd);

function getOutput({cmd, cwd}) {
    if (MADRUN_PWD)
        return `> ${cmd} (${cwd})`;
    
    if (MADRUN_NAME)
        return `> ${cmd} (${basename(cwd)})`;
    
    return `> ${cmd}`;
}

async function execute(cmd) {
    const {execSync} = await import('child_process');
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
    const {pathToFileURL} = require('url');
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
    const {
        readFile,
        writeFile,
    } = await import('fs/promises');
    
    const data = await readFile(name, 'utf8');
    const {places, code} = await runPutout(data);
    
    if (fix)
        await writeFile(name, code);
    
    return places;
}

