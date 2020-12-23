'use strict';

import {join} from 'path';
import {
    readFile,
    writeFile,
    access,
} from 'fs/promises';

import tryToCatch from 'try-to-catch';
import montag from 'montag';
import readjson from 'readjson';

const CWD = process.cwd();

export async function readPackage () {
    const [error, info] = await  tryToCatch(readjson,`${CWD}/package.json`);

    if (error) {
        console.error(error.message);
        process.exit(1);
    }

    return info;
}

const {stringify} = JSON;
const {keys} = Object;

export const createMadrun = async (info) => {
    let name = await findMadrun();

    if (name)
        return name;

    const {scripts = {}} = info;

    const madrun = montag `
        'use strict';
        
        const {
            run,
            series,
            parallel,
        } = require('madrun');
        module.exports = ${stringify(scripts, null, 4)};
    `;


    if (!name)  {
        name = join(CWD, '.madrun.js');
        await writeFile(name, madrun);
    }
    
    return name;
};

const tryToImport = async (name) => {
    let data;

    try {
        data = await import(name)
    } catch (error) {
        return [error, data];
    }

    return [null, data.default]
};

export const patchPackage = async (name, info) => {
    const [error, content] = await tryToImport(name);

    if (error)
        return error;
    
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

const joinPartial = (a) => (b) => join(a, b)

export async function findMadrun() {
    const madrunNames = [
        '.madrun.js',
        '.madrun.mjs',
        '.madrun.cjs',
    ].map(joinPartial(CWD));
    
    for (const name of madrunNames) {
        const [error] = await tryToCatch(access, name);

        if (!error)
            return name;
    }

    return '';
};