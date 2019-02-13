'use strict';

const keys = require('all-object-keys');
const jessy = require('jessy');

module.exports = (scripts) => {
    const result = [];
    const all = keys(scripts);
    
    for (const key of all) {
        const fn = jessy(key, scripts);
        
        if (typeof fn !== 'function')
            result.push(key);
    }
    
    return result;
};

