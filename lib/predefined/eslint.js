'use strict';

const addPattern = (name) => `--ignore-pattern '${name}'`;

module.exports = ({names = [], ignore = [], rulesdir = ''} = {}) => {
    const ignored = getIgnored(ignore);
    const rules = getRules(rulesdir);
    const line = `eslint ${names.join(' ')} ${rules} ${ignored.map(addPattern).join(' ')}`;
    
    return line
        .replace(RegExp(' {2}'), ' ');
};

function getIgnored(ignore) {
    return [
        '!.eslintrc.js',
        '!.madrun.js',
        ...ignore,
    ];
}

function getRules(dir) {
    if (!dir)
        return '';
    
    return `--rulesdir ${dir}`;
}

