# 🏎 Madrun [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL] [![Coverage Status][CoverageIMGURL]][CoverageURL]

![image](https://user-images.githubusercontent.com/1573141/223524904-4175548f-1e30-4745-bf2e-c2f4ea39fef5.png)

[NPMURL]: https://npmjs.org/package/madrun "npm"
[NPMIMGURL]: https://img.shields.io/npm/v/madrun.svg?style=flat
[BuildStatusURL]: https://github.com/coderaiser/madrun/actions?query=workflow%3A%22Node+CI%22 "Build Status"
[BuildStatusIMGURL]: https://github.com/coderaiser/madrun/workflows/Node%20CI/badge.svg
[LicenseURL]: https://tldrlegal.com/license/mit-license "MIT License"
[LicenseIMGURL]: https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[CoverageURL]: https://coveralls.io/github/coderaiser/madrun?branch=master
[CoverageIMGURL]: https://coveralls.io/repos/coderaiser/madrun/badge.svg?branch=master&service=github

CLI tool to run multiple npm-scripts in a madly comfortable way. Can be used together with [redrun](https://github.com/coderaiser/redrun).

## Install

```
npm i madrun -g
```

# Usage

First thing you should do is:

- ✅ create `.madrun.js` file with all scripts written in **JavaScript**;
- ✅ update `package.json` scripts to use **madrun**;

This can be done using:

```sh
madrun --init
```

When you create new script, you can run it with: `madrun lint test`.
Run `madrun --init` again, to update `package.json`, so you can use:

```sh
npm run lint
npm test
```

Then you can run `madrun` without args to see list of a scripts. Or run:

```
madrun <script>
```

To run specified script.

# Completion

You can enable tab-completion of npm scripts similar to [npm's completion](https://docs.npmjs.com/cli/completion) using:

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
MADRUN_NAME=1 madrun lint
> putout lib test .madrun.js (cloudcmd)
```

## API

`madrun` supports next `API` set:

### run(name, [opt, env])

Run script by a name or regexp.

- `name` - name of a script
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

### cutEnv(name, [opt, env])

Same as `run`, but returns result without `env`.

- `name` - name of a script
- `opt` - options to run with
- `env` - object with `env` variables
- `scripts` - all scripts set (need for embedding only)

## Example

Let's install `madrun` and save it as `devDependency` with:

```sh
npm i madrun -D
```

Let's create file `.madrun.js`:

```js
import {run, cutEnv} from 'madrun';

const env = {
    CI: 1,
};

export default {
    'lint': () => 'putout .',
    'fix:lint': async () => await run('lint', '--fix', {
        NODE_ENV: 'development',
    }),
    'lint:env': () => ['putout .', {
        CI: 1,
    }],
    'env:lint': () => [env, 'putout .'],
    'lint:no-env': async () => await cutEnv('lint:env'),
};
```

Now you can call any of listed scripts with help of 🏎 **Madrun**:

```sh
madrun lint
> putout .
```

For **series run** you can use:

```sh
madrun lint:*
> CI=1 putout . && putout .
```

## Related

- [redrun](https://github.com/coderaiser/redrun) - CLI tool to run multiple npm-scripts fast.

## License

MIT
