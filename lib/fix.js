'use strict';

const putout = require('putout');
const dumpFormatter = require('@putout/formatter-dump');
const pluginMadrun = require('@putout/plugin-madrun');

const report = putout.initReport();

module.exports = (data) => {
    const {code, places} = putout(data, {
        plugins: [{
            'madrun': pluginMadrun,
        }],
    });
    
    return {
        code,
        places: report(dumpFormatter, {
            name: 'madrun.js',
            places,
        }),
    };
};

