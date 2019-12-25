'use strict';

const help = require('../help');

const {entries} = Object;

module.exports = () => {
    const result = [];
    
    for (const [name, description] of entries(help)) {
        result.push(`${name} ${description}`);
    }
    
    return result.join('\n');
};

