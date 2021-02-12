'use strict';

const help = require('../help');

const {entries} = Object;

module.exports.help = () => {
    const result = [
        'Usage: madrun [options] [script]',
        'Options:',
    ];
    
    for (const [name, description] of entries(help)) {
        result.push(`  ${name} ${description}`);
    }
    
    return result.join('\n');
};

