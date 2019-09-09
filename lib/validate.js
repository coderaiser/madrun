'use strict';

const tryCatch = require('try-catch');

module.exports = (runners) => {
    for (const run of Object.keys(runners)) {
        const [e] = tryCatch(run);
        
        if (e)
            return e;
    }
    
    return null;
};

