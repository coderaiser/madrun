'use strict';

module.exports = ({names = [], rulesdir = ''} = {}) => {
    const rules = getRules(rulesdir);
    const line = `putout ${names.join(' ')} ${rules}`;
    
    return line
        .replace(RegExp(' {2}'), ' ');
};

function getRules(dir) {
    if (!dir)
        return '';
    
    return `--rulesdir ${dir}`;
}

