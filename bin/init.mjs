'use strict';


import {
    readFile,
    writeFile,
    access,
} from 'fs/promises';

import tryCatch from 'try-catch';
import tryToCatch from 'try-to-catch';
import montag from 'montag';
import readjson from 'readjson';

const CWD = process.cwd();
const info = await readjson(`${CWD}/package.json`);

const {scripts = {}} = info;
const {stringify} = JSON;
const {keys} = Object;

const madrun = montag `
    'use strict';
    
    const {
        run,
        series,
        parallel,
    } = require('madrun');

    module.exports = ${stringify(scripts, null, 4)};
`;

export const create = async () => {
    let name = await findMadrun();

    if (!name)  {
        name = join(CWD, '.madrun.js');
        await writeFile(name, madrun);
    }
    
    return name;
};

export const patchPackage = async (name) => {
    const {default: content} = await import(name);
    const updatedScripts = updatePackage(content);
    const prepared = preparePackage(info, updatedScripts);
    
    await writeFile('./package.json', prepared);
};

async function preparePackage(info, scripts) {
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

const joinPartial = (a) => (b) => join(b, a)
async function findMadrun() {
    const madrunNames = [
        '.madrun.js',
        '.madrun.mjs',
        '.madrun.cjs',
    ].map(joinPartial(CWD));
    
    for (const name of madrunNames) {
        const [error] = await tryToCatch(access, name);
        
        if (error)
            continue;

        return name;
    }

    return '';
};
