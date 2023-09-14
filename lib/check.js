'use strict';

const keys = require('all-object-keys');
const jessy = require('jessy');
const isFn = (a) => typeof a === 'function';

module.exports = (scripts) => {
    const problems = getNames(scripts);
    
    if (!problems.length)
        return '';
    
    return `echo 'fix scripts first: "${problems.join('", "')}"'`;
};

function getNames(scripts) {
    const result = [];
    const all = keys(scripts);
    
    for (const key of all) {
        const fn = jessy(key, scripts);
        
        if (!isFn(fn))
            result.push(key);
    }
    
    return result;
}
