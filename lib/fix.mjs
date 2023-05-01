import putout, {
    initReport,
} from 'putout';
import dumpFormatter from '@putout/formatter-dump';

const report = initReport();

export const runPutout = async (data, options) => {
    const {
        code,
        places,
    } = putout(data, {
        printer: 'putout',
        ...options,
        plugins: [
            'madrun',
        ],
    });
    
    return {
        code,
        places: await report(dumpFormatter, {
            name: '.madrun.js',
            places,
        }),
    };
};

