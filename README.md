# Madrun [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Dependency Status][DependencyStatusIMGURL]][DependencyStatusURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL] [![Coverage Status][CoverageIMGURL]][CoverageURL]

CLI tool to run multiple npm-scripts in a madly comfortable way. Can be used together with [redrun](https://github.com/coderaiser/redrun).

## Install

```
npm i madrun -g
```

# Usage

First thing you should do is create `.madrun.js` file.
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

## API

`madrun` supports next `API` set:

### run(name, [opt])
Run script by a name or regexp.

- `name` - name of a sript
- `opt` - options to run with
- `scripts` - all scripts set (need for embedding only)

### series(names, [opt, scripts])
Run scripts by a name or regexp one-by-one.

- `name` - array of names of scrips
- `opt` - options to run with
- `scripts` - all scripts set (need for embedding only)

### parallel (names, [opt, scripts])
Run scripts by a name or regexp parallel.

- `name` - array of names of scrips
- `opt` - options to run with
- `scripts` - all scripts set (need for embedding only)

## Example

Let's install `madrun` and save it as `devDependency` with:

```sh
npm i madrun -D
```

Let's create file `.madrun.js`:

```js
const {
    run,
    parallel,
} = require('madrun');

module.exports = {
    'lint:lib': 'eslint lib',
    'lint:bin': 'eslint bin',
    'lint': run('lint:*'),
    'fix:lint': parallel(['lint:lib, 'lint:bin'], 'fix'),
};
```

Now you can call any of listed scripts with help of `madrun cli`:

```sh
$ madrun lint
> eslint lib && eslint bin
```

For parallel fix with can use:

```sh
$ madrun fix:lint
> eslint eslint lib --fix & eslin bin --fix
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

