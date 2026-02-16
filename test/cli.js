import {test} from 'supertape';
import runsome from 'runsome';
import packageJson from '../package.json' with {
    type: 'json',
};
import {help} from '../lib/help.js';

const {version} = packageJson;
const cliPath = new URL('../bin/madrun.js', import.meta.url).pathname;
const run = runsome(cliPath);

test('madrun: cli: -v', (t) => {
    const result = run('-v');
    const expected = `v${version}`;
    
    t.equal(result, expected);
    t.end();
});

test('madrun: cli: --version', (t) => {
    const result = run('--version');
    const expected = `v${version}`;
    
    t.equal(result, expected);
    t.end();
});

test('madrun: cli: --help', (t) => {
    const result = run('--help');
    const expected = help();
    
    t.equal(result, expected);
    t.end();
});

test('madrun: cli: -h', (t) => {
    const result = run('--h');
    const expected = help();
    
    t.equal(result, expected);
    t.end();
});

test('madrun: cli: script not found', (t) => {
    const result = run('xxx');
    const expected = 'one of scripts not found: xxx';
    
    t.equal(result, expected);
    t.end();
});

test('madrun: cli: kill', (t) => {
    const result = run('lint', {
        timeout: 2000,
    });
    
    const expected = '> putout .';
    
    t.match(result, expected);
    t.end();
});
