'use strict';

const {isArray} = Array;

module.exports = (options) => {
    const {
        names = [],
        rulesdir = '',
    } = parseOptions(options);
    
    const rules = getRules(rulesdir);
    const line = `putout ${names.join(' ')}${rules}`;
    
    return line
        .replace(RegExp(' {2}'), ' ');
};

function getRules(dir) {
    if (!dir)
        return '';
    
    return ` --rulesdir ${dir}`;
}

function parseOptions(options = {}) {
    if (isArray(options))
        return {
            names: options,
        };
    
    return options;
}

