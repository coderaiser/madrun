'use strict';

const {pathToFileURL} = require('node:url');
const keys = require('all-object-keys');
const jessy = require('jessy');

const wildcard = require('./wildcard');
const check = require('./check');
const supported = require('../supported');
const maybeArray = (a) => isArray(a) ? a : [a];
const isStr = (a) => typeof a === 'string';
const {isArray} = Array;

async function getFindUp() {
    if (global.MADRUN_FINDUP)
        return global.MADRUN_FINDUP;
    
    const {findUpSync} = await import('find-up');
    
    return findUpSync;
}

async function getScripts() {
    const findUp = await getFindUp();
    const path = findUp(supported);
    
    if (!path)
        throw Error('.madrun.js is missing!');
    
    return (await import(pathToFileURL(path))).default;
}

module.exports.cutEnv = async (names, opts = '', env, scripts) => {
    names = maybeArray(names);
    scripts = scripts || await getScripts();
    
    const isParallel = false;
    
    const commands = await run(names, opts, scripts, {
        env,
        cutEnv: true,
        isParallel,
    });
    
    return joinByType(commands, {
        isParallel,
    });
};

module.exports.run = async (name, opts = '', env, scripts) => {
    scripts = scripts || await getScripts();
    
    const problems = check(scripts);
    
    if (problems)
        return problems;
    
    return await series(name, opts, env, scripts);
};

module.exports.series = series;

async function series(names, opts = '', env, scripts) {
    names = maybeArray(names);
    scripts = scripts || await getScripts();
    
    const isParallel = false;
    
    const commands = await run(names, opts, scripts, {
        env,
        isParallel,
    });
    
    return joinByType(commands, {
        isParallel,
    });
}

module.exports.parallel = async (names, opts = '', env, scripts) => {
    scripts = scripts || await getScripts();
    names = maybeArray(names);
    
    const isParallel = true;
    
    const commands = await run(names, opts, scripts, {
        env,
        isParallel,
    });
    
    return joinByType(commands, {
        isParallel,
    });
};

function joinByType(commands, {isParallel}) {
    const type = isParallel ? ' & ' : ' && ';
    return commands.join(type);
}

async function run(names, opts, scripts, {env, isParallel, cutEnv}) {
    const cmds = [];
    
    for (const name of names) {
        const cmd = await parse(name, {
            scripts,
            opts,
            env,
            isParallel,
            cutEnv,
        });
        
        cmds.push(cmd);
    }
    
    return cmds;
}

const addOpts = (name, opts) => {
    if (!opts)
        return name;
    
    return `${name} ${opts}`;
};

const addEnv = (cmd, env) => {
    const entries = env && Object.entries(env);
    
    if (!env || !entries.length)
        return cmd;
    
    const line = [];
    
    for (const [key, value] of entries) {
        line.push(`${key}=${value}`);
    }
    
    const envLine = line.join(' ');
    
    return `${envLine} ${cmd}`;
};

const parse = async (name, {scripts, opts, env, isParallel, cutEnv}) => {
    const result = [];
    const all = keys(scripts);
    
    for (const key of all) {
        if (!wildcard(`^${name}$`).test(key))
            continue;
        
        const fn = jessy(key, scripts);
        
        const {line, lineEnv} = await runScriptFn(fn);
        
        const cmd = addOpts(line, opts);
        
        const cmdEnv = addEnv(cmd, {
            ...cutEnv ? {} : lineEnv,
            ...env,
        });
        
        const processed = await addPrePost(cmdEnv, key, scripts);
        
        result.push(processed);
    }
    
    if (!result.length)
        throw Error(`one of scripts not found: ${name}`);
    
    return joinByType(result, {
        isParallel,
    });
};

async function runScriptFn(fn) {
    const result = await fn();
    
    if (!isArray(result))
        return {
            line: result,
            lineEnv: {},
        };
    
    const [a, b] = result;
    
    if (isStr(a))
        return {
            line: a,
            lineEnv: b,
        };
    
    return {
        line: b,
        lineEnv: a,
    };
}

async function addPrePost(cmd, key, scripts) {
    const pre = jessy(`pre${key}`, scripts);
    const post = jessy(`post${key}`, scripts);
    
    if (pre)
        cmd = `${await pre()} && ${cmd}`;
    
    if (post)
        cmd = `${cmd} && ${await post()}`;
    
    return cmd;
}
