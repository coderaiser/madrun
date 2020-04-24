'use strict';

const {readFileSync} = require('fs');
const {dirname} = require('path');
const {createRequire} = require('module');

const tryCatch = require('try-catch');
const putout = require('putout');
const esm = require('@putout/plugin-convert-esm-to-commonjs');

module.exports = (name) => {
    const [e, result] = tryCatch(require, name);
    
    if (!e)
        return result;
    
    const data = read(name);
    
    return run(name, data);
};

function read(name) {
    const data = readFileSync(name, 'utf8');
    
    const {code} = putout(data, {
        plugins: [{
            esm,
        }],
    });
    
    return code;
}

function run(name, code) {
    const args = [
        'exports',
        'require',
        'module',
        '__filename',
        '__dirname',
    ];
    
    const fn = Function(args, code);
    
    const exports = {};
    const require = createRequire(name);
    const module = {
        exports,
    };
    const filename = name;
    const dir = dirname(name);
    
    fn(module.exports, require, module, filename, dir);
    
    return module.exports;
}

