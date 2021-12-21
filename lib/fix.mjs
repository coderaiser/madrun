import putout, {
    initReport,
} from 'putout';

import dumpFormatter from '@putout/formatter-dump';
import madrun from '@putout/plugin-madrun';

const report = initReport();

export const runPutout = async (data, options) => {
    const {code, places} = putout(data, {
        ...options,
        plugins: [{
            madrun,
        }],
    });
    
    return {
        code,
        places: await report(dumpFormatter, {
            name: '.madrun.js',
            places,
        }),
    };
};

