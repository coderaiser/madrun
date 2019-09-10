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
    if (!existsSync('./madrun.js'))
        writeFileSync('./madrun.js', madrun);
};

module.exports.patchPackage = () => {
    const updatedScripts = patchPackage(require(`${CWD}/madrun`));
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
        result[key] = `madrun ${key}`;
    }
    
    return result;
}

function updateNpmIgnore() {
    const [, file = ''] = tryCatch(readFileSync, './.npmignore');
    
    if (file.includes('madrun.js'))
        return;
    
    const data = file + 'madrun.js\n\n';
    writeFileSync('./.npmignore', data);
}

