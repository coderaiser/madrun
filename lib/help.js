'use strict';

const help = require('../help');

const {entries} = Object;

module.exports.help = () => {
    const result = [];
    
    for (const [name, description] of entries(help)) {
        result.push(`${name} ${description}`);
    }
    
    return result.join('\n');
};

