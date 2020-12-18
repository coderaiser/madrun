'use strict';

const CWD = process.cwd();

const {
    readFileSync,
    writeFileSync,
    existsSync,
} = require('fs');

const tryCatch = require('try-catch');
const info = require(`${CWD}/package`);

const {scripts = {}} = info;
const madrun =
`'use strict';

const {
    run,
    series,
    parallel,
} = require('madrun');

module.exports = ${JSON.stringify(scripts, null, 4)};

`;

module.exports.create = () => {
    if (!existsSync('./.madrun.js') && !existsSync('./.madrun.mjs'))
        writeFileSync('./.madrun.js', madrun);
};

module.exports.patchPackage = async () => {
    const {default: content} = await import(`${CWD}/.madrun.js`);
    const updatedScripts = await patchPackage(content);
    
    writeFileSync('./package.json', await preparePackage(info, updatedScripts));
};

module.exports.patchNpmIgnore = updateNpmIgnore;

async function preparePackage(info, scripts) {
    const data = {
        ...info,
        scripts,
    };
    
    return JSON.stringify(data, null, 2) + '\n';
}

async function patchPackage(scripts) {
    const result = {};
    const keys = Object.keys(scripts);
    
    for (const key of keys) {
        if (/^(pre|post)/.test(key))
            continue;
        
        result[key] = `madrun ${key}`;
    }
    
    return result;
}

async function updateNpmIgnore() {
    const [, file = ''] = tryCatch(readFileSync, './.npmignore');
    
    const isMadrun = file.includes('.madrun');
    const isDotAll = file.includes('.*');
    
    if (isDotAll || isMadrun)
        return;
    
    const data = file + '.madrun.js\n\n';
    writeFileSync('./.npmignore', data);
}

