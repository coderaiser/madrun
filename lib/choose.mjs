import enquirer from 'enquirer';
import actions from 'enquirer/lib/combos.js';
import tryToCatch from 'try-to-catch';

const {MultiSelect} = enquirer;

const custom = {
    h: 'left',
    j: 'down',
    k: 'up',
    l: 'right',
    enter: 'i',
};

actions.keys = {
    ...actions.keys,
    ...custom,
};

export const choose = async (scripts) => {
    const prompt = new MultiSelect({
        message: 'Run:',
        onSubmit() {
            this.enable(this.focused);
        },
        choices: Object.keys(scripts),
    });
    
    const answer = await run(prompt);
    
    return answer || [];
};

async function run(prompt) {
    const [, answer] = await tryToCatch(prompt.run.bind(prompt));
    return answer;
}
