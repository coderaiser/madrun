import {createRequire} from 'node:module';
import {join} from 'node:path';
import {
    writeFile as _writeFile,
    access as _access,
} from 'node:fs/promises';
import {tryToCatch} from 'try-to-catch';
import montag from 'montag';

const require = createRequire(import.meta.url);

const supported = require('../supported.json');
const {keys} = Object;

const {stringify} = JSON;

export const createMadrun = async (cwd, info = {}, overrides = {}) => {
    const {
        access = _access,
        writeFile = _writeFile,
    } = overrides;
    
    let name = await findMadrun(cwd, {
        access,
    });
    
    if (!name) {
        const {scripts = {}} = info;
        
        const madrun = montag`
            'use strict';
            
            const {
                run,
                series,
                parallel,
            } = require('madrun');
            
            module.exports = ${stringify(scripts, null, 4)};
        `;
        
        name = join(cwd, '.madrun.js');
        await writeFile(name, madrun);
    }
    
    return name;
};

export const patchPackage = async (name, info, overrides = {}) => {
    const {
        writeFile = _writeFile,
    } = overrides;
    
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
        if (key.startsWith('pre') && key !== 'prepare')
            continue;
        
        if (key.startsWith('post'))
            continue;
        
        result[key] = `madrun ${key}`;
    }
    
    return result;
}

const joinPartial = (a) => (b) => join(a, b);

async function findMadrun(cwd, {access}) {
    const madrunNames = supported.map(joinPartial(cwd));
    
    for (const name of madrunNames) {
        const [error] = await tryToCatch(access, name);
        
        if (!error)
            return name;
    }
    
    return '';
}
