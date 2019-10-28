'use strict';

const putout = require('putout');
const dumpFormatter = require('@putout/formatter-dump');
const madrun = require('@putout/plugin-madrun');

const report = putout.initReport();

module.exports = (data, options) => {
    const {code, places} = putout(data, {
        ...options,
        plugins: [{
            madrun,
        }],
    });
    
    return {
        code,
        places: report(dumpFormatter, {
            name: '.madrun.js',
            places,
        }),
    };
};

