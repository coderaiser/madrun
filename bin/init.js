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
    if (!existsSync('./.madrun.js'))
        writeFileSync('./.madrun.js', madrun);
};

module.exports.patchPackage = () => {
    const updatedScripts = patchPackage(require(`${CWD}/.madrun`));
    writeFileSync('./package.json', preparePackage(info, updatedScripts));
};

module.exports.patchNpmIgnore = () => {
    updateNpmIgnore();
};

function preparePackage(info, scripts) {
    const data = {
        ...info,
        scripts: {
            ...scripts,
        },
    };
    
    return JSON.stringify(data, null, 2) + '\n';
}

function patchPackage(scripts) {
    const result = {};
    const keys = Object.keys(scripts);
    
    for (const key of keys) {
        if (/^(pre|post)/.test(key))
            continue;
        
        result[key] = `madrun ${key}`;
    }
    
    return result;
}

function updateNpmIgnore() {
    const [, file = ''] = tryCatch(readFileSync, './.npmignore');
    
    const isMadrun = file.includes('.madrun.js');
    const isDotAll = file.includes('.*');
    
    if (isDotAll || isMadrun)
        return;
    
    const data = file + '.madrun.js\n\n';
    writeFileSync('./.npmignore', data);
}

