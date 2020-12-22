'use strict';

const {join} = require('path');
const {
    writeFile,
    access,
} = require('fs/promises');

const tryToCatch = require('try-to-catch');
const montag = require('montag');

const {stringify} = JSON;
const {keys} = Object;

module.exports.createMadrun = async (cwd, info) => {
    let name = await findMadrun(cwd);
    
    if (!name) {
        const {scripts = {}} = info;
        
        const madrun = montag `
            'use strict';
            
            const {
                run,
                series,
                parallel,
            } = require('madrun');
            
            module.exports = ${stringify(scripts)};
        `;
        
        name = join(cwd, '.madrun.js');
        await writeFile(name, madrun);
    }
    
    return name;
};

module.exports.patchPackage = async (name, info) => {
    const {default: content} = await import(name);
    
    const updatedScripts = updatePackage(content);
    const prepared = preparePackage(info, updatedScripts);
    
    await writeFile('./package.json', prepared);
};

function preparePackage(info, scripts) {
    const data = {
        ...info,
        scripts,
    };
    
    return stringify(data, null, 2) + '\n';
}

function updatePackage(scripts) {
    const result = {};
    
    for (const key of keys(scripts)) {
        if (/^(pre|post)/.test(key))
            continue;
        
        result[key] = `madrun ${key}`;
    }
    
    return result;
}

const joinPartial = (a) => (b) => join(a, b);

async function findMadrun(cwd) {
    const madrunNames = [
        '.madrun.js',
        '.madrun.mjs',
        '.madrun.cjs',
    ].map(joinPartial(cwd));
    
    for (const name of madrunNames) {
        const [error] = await tryToCatch(access, name);
        
        if (!error)
            return name;
    }
    
    return '';
}

