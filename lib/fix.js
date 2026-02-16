import putout from 'putout';
import {initReport} from '@putout/engine-reporter/report';
import _formatterDump from '@putout/formatter-dump';

const report = initReport();

export const runPutout = async (data, options, overrides = {}) => {
    const {
        formatterDump = _formatterDump,
    } = overrides;
    
    const {code, places} = putout(data, {
        printer: 'putout',
        ...options,
        plugins: ['madrun'],
    });
    
    return {
        code,
        places: await report(formatterDump, {
            name: '.madrun.js',
            places,
        }),
    };
};
