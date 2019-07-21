'use strict';

const addPattern = (name) => `--ignore-pattern '${name}'`;

module.exports = ({names = [], ignore = []} = {}) => {
    const ignored = getIgnored(ignore);
    const line = `eslint ${names.join(' ')} ${ignored.map(addPattern).join(' ')}`;
    
    return line.trimEnd();
};

function getIgnored(ignore) {
    return [
        '!.eslintrc.js',
        ...ignore,
    ];
}

