'use strict';

const putout = require('putout');
const pluginMadrun = require('@putout/plugin-madrun');

module.exports = (data) => {
    const {code, places} = putout(data, {
        plugins: [{
            'madrun': pluginMadrun,
        }],
    });
    
    return {
        code,
        places: putout.prettify('.madrun.js', places),
    };
};

