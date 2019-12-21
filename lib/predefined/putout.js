'use strict';

const {isArray} = Array;

module.exports = (options) => {
    const {
        names = [],
        rulesdir = '',
        formatter = '',
    } = parseOptions(options);
    
    const rules = getRules(rulesdir);
    const format = getFormat(formatter);
    const line = `putout ${names.join(' ')}${rules}${format}`;
    
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

function getFormat(formatter) {
    if (!formatter)
        return '';
    
    return ` -f ${formatter}`;
}
