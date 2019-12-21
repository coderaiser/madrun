# Madrun [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Dependency Status][DependencyStatusIMGURL]][DependencyStatusURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL] [![Coverage Status][CoverageIMGURL]][CoverageURL]

CLI tool to run multiple npm-scripts in a madly comfortable way. Can be used together with [redrun](https://github.com/coderaiser/redrun).

## Install

```
npm i madrun -g
```

# Usage

First thing you should do is create `.madrun.js` file.
This can be done using:

```sh
madrun --init
```

`madrun` will import all scripts to `.madrun.js`, and add it to `.npmignore`.

When update `.madrun.js`, adding new scripts, run `madrun --init` again, to update `package.json`, so you can use:

```sh
npm run new-script-name
```

Then you can run `madrun` without args to see list of a scripts. Or run: 

```
madrun <script>
```

To run specified script.

# Completion

You can enable tab-completion of npm scripts similar to [npm's completion](
https://docs.npmjs.com/cli/completion) using:

```sh
madrun-completion >> ~/.bashrc
madrun-completion >> ~/.zshrc
```

You may also pipe the output of madrun-completion to a file such as `/usr/local/etc/bash_completion.d/madrun` if you have a system that will read that file for you.

## Options

`Madrun` can be configured using `env variables`.

### MADRUN_PWD
`MADRUN_PWD` will output current directory path:

```sh
MADRUN_PWD=1 madrun lint
> putout lib test .madrun.js (/home/coderaiser/cloudcmd)
```

### MADRUN_NAME
`MADRUN_NAME` will output name of current directory:

```sh
MADRUN_PWD=1 madrun lint
> putout lib test .madrun.js (cloudcmd)
```

## API

`madrun` supports next `API` set:

### run(name, [opt, env])
Run script by a name or regexp.

- `name` - name of a sript
- `opt` - options to run with
- `env` - object with `env` variables
- `scripts` - all scripts set (need for embedding only)

### series(names, [opt, env, scripts])
Run scripts by a name or regexp one-by-one.

- `name` - array of names of scrips
- `opt` - options to run with
- `env` - object with `env` variables
- `scripts` - all scripts set (need for embedding only)

### parallel (names, [opt, env, scripts])
Run scripts by a name or regexp parallel.

- `name` - array of names of scrips
- `opt` - options to run with
- `env` - object with `env` variables
- `scripts` - all scripts set (need for embedding only)

### Predefined scripts

You can easilly add one of predefined scripts

#### eslint({names, ignore})

```js
eslint({
    names: ['a'],
    ignore: ['b'],
});
// returns
`eslint a --ignore-pattern 'b'`
```

#### eslint({names, ignore, rulesdir})

```js
eslint({
    names: ['a'],
    ignore: ['b'],
});
// returns
`eslint a --ignore-pattern 'b'`
```

#### putout({names, rulesdir, formatter}) || putout(names)

```js
const names = ['a'];

putout(names)
// returns
`putout a`;

putout({names})
// returns
`putout a`;
```

## Example

Let's install `madrun` and save it as `devDependency` with:

```sh
npm i madrun -D
```

Let's create file `madrun.js`:

```js
const {
    run,
    predefined,
} = require('madrun');

const {putout} = predefined;

module.exports = {
    'lint': () => {
        const names = [
            'bin',
            'lib',
            'test',
        ];
        
        putout({
            names
        });
    },
    'fix:lint': () => run('lint', '--fix', {
        NODE_ENV: 'development'
    });
};
```

Now you can call any of listed scripts with help of `madrun cli`:

```sh
$ madrun lint
> putout lib
```

For parallel fix with can use:

```sh
$ madrun fix:lint
> NODE_ENV=development putout lib --fix
```

## Related

- [redrun](https://github.com/coderaiser/redrun) - CLI tool to run multiple npm-scripts fast.

## License

MIT

[NPMIMGURL]:                https://img.shields.io/npm/v/madrun.svg?style=flat
[BuildStatusIMGURL]:        https://img.shields.io/travis/coderaiser/madrun/master.svg?style=flat
[DependencyStatusIMGURL]:   https://img.shields.io/david/coderaiser/madrun.svg?style=flat
[LicenseIMGURL]:            https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[NPMURL]:                   https://npmjs.org/package/madrun "npm"
[BuildStatusURL]:           https://travis-ci.org/coderaiser/madrun  "Build Status"
[DependencyStatusURL]:      https://david-dm.org/coderaiser/madrun "Dependency Status"
[LicenseURL]:               https://tldrlegal.com/license/mit-license "MIT License"

[CoverageURL]:              https://coveralls.io/github/coderaiser/madrun?branch=master
[CoverageIMGURL]:           https://coveralls.io/repos/coderaiser/madrun/badge.svg?branch=master&service=github

