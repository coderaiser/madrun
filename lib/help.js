import helpJson from '../help.json' with {
    type: 'json',
};

const {entries} = Object;

export const help = () => {
    const result = [
        'Usage: madrun [options] [script]',
        'Options:',
    ];
    
    for (const [name, description] of entries(helpJson)) {
        result.push(`  ${name} ${description}`);
    }
    
    return result.join('\n');
};
