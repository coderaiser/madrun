'use strict';

const keys = require('all-object-keys');
const jessy = require('jessy');
const findUp = require('find-up');

const wildcard = require('./wildcard');
const check = require('./check');

const isStr = (a) => typeof a === 'string';

function getScripts() {
    const path = findUp.sync('.madrun.js');
    
    if (!path)
        throw Error('.madrun.js is missing!');
    
    return require(path);
}

module.exports.predefined = require('./predefined');

module.exports.run = (name, opts = '', env, scripts = getScripts()) => {
    const problems = check(scripts);
    
    if (problems)
        return problems;
    
    return series(name, opts, env, scripts);
};

module.exports.series = series;

async function series(names, opts = '', env, scripts = getScripts()) {
    names = isStr(names) ? [names] : names;
    const isParallel = false;
    
    const commands = await run(names, opts, scripts, {env, isParallel: false});
    
    return joinByType(commands, {
        isParallel,
    });
}

module.exports.parallel = async (names, opts = '', env, scripts = getScripts()) => {
    names = isStr(names) ? [names] : names;
    
    const isParallel = true;
    const commands = await run(names, opts, scripts, {env, isParallel});
    
    return joinByType(commands, {
        isParallel,
    });
};

function joinByType(commands, {isParallel}) {
    const type = isParallel ? ' & ' : ' && ';
    
    return commands.join(type);
}

async function run(names, opts, scripts, {env, isParallel}) {
    const process = parse(scripts, opts, {
        env,
        isParallel,
    });
    
    const cmd = [];
    
    for (const name of names) {
        cmd.push(await process(name));
    }
    
    return cmd;
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

const parse = (scripts, opts, {env, isParallel}) => async (name) => {
    const result = [];
    
    const all = keys(scripts);
    for (const key of all) {
        if (!wildcard(`^${name}$`).test(key))
            continue;
        
        const fn = jessy(key, scripts);
        
        const cmd = addOpts(await fn(), opts);
        const cmdEnv = addEnv(cmd, env);
        const processed = addPrePost(cmdEnv, key, scripts);
        
        result.push(processed);
    }
    
    if (!result.length)
        throw Error(`one of scripts not found: ${name}`);
    
    return joinByType(result, {
        isParallel,
    });
};

function addPrePost(cmd, key, scripts) {
    const pre = jessy(`pre${key}`, scripts);
    const post = jessy(`post${key}`, scripts);
    
    if (pre)
        cmd = `${pre()} && ${cmd}`;
    
    if (post)
        cmd = `${cmd} && ${post()}`;
    
    return cmd;
}

