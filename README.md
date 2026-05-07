# 🎩ESCover [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL] [![Coverage Status][CoverageIMGURL]][CoverageURL]

[NPMIMGURL]: https://img.shields.io/npm/v/escover.svg?style=flat
[BuildStatusURL]: https://github.com/coderaiser/escover/actions?query=workflow%3A%22Node+CI%22 "Build Status"
[BuildStatusIMGURL]: https://github.com/coderaiser/escover/workflows/Node%20CI/badge.svg
[LicenseIMGURL]: https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[NPMURL]: https://npmjs.org/package/escover "npm"
[LicenseURL]: https://tldrlegal.com/license/mit-license "MIT License"
[CoverageURL]: https://coveralls.io/github/coderaiser/escover?branch=master
[CoverageIMGURL]: https://coveralls.io/repos/coderaiser/escover/badge.svg?branch=master&service=github

Coverage for EcmaScript Modules based on 🐊[**Putout**](https://github.com/coderaiser/putout) and [loaders](https://nodejs.org/dist/latest-v20.x/docs/api/esm.html#loaders).

## Why another coverage tool?

When you want to use `ESM` in `Node.js` without transpiling to `CommonJS` (that's what `jest`, `ava`, `tap` does),
you have a couple problems to solve.

### 🤷‍ What test runner does no transpiling to `CommonJS`?

☝️ that's easy! 📼 [**Supertape**](https://github.com/coderaiser/supertape) supports `ESM` from the box;

### 🤷‍ How to get coverage when `nyc` doesn't supported?

☝️ `c8` could help, but [no](https://github.com/coderaiser/c8-reproduce) it supports no `query parameters`
which are needed to load module again, and apply mocks.

### 🤷‍  How to get coverage when mocks are used?

☝️ Use 🎩**ESCover**! It supports loaders, `ESM` and collects coverage as a loader!

### 🤷‍  What with [`coveralls`](https://coveralls.io/)? Does [`lcov`](https://github.com/StevenLooman/mocha-lcov-reporter) supported?

☝️ Sure! `coverage/lcov.info` is main coverage file for 🎩**ESCover**.

## Install

```
npm i escover -D
```

Run to collect and show coverage:

```sh
escover npm test
```

## Comparison with `c8`

Check out the real example from [wisdom](https://github.com/coderaiser/wisdom). There is next uncovered code:

```js
import {jessy} from 'jessy';

export default (info) => typeof jessy('publishConfig.access', info) === 'undefined';
```

`c8` shows three columns with 100% and one with 0%.

<img width="584" alt="image" src="https://user-images.githubusercontent.com/1573141/169064257-579d6770-095e-475b-a7bc-8275849c8dc2.png">

And here is what you will see with 🎩**ESCover**:

<img width="403" alt="image" src="https://user-images.githubusercontent.com/1573141/169064550-62aa2398-b370-496f-8c8b-418d0d2d6004.png">

So if you need more accurate code with no bullshit green 100%, use 🎩**ESCover** 😉.

## Config

`exclude` section of configuration file `.nyrc.json` supported.

## How it looks like?

When everything is covered:

![image](https://user-images.githubusercontent.com/1573141/149822261-ff9bc3b4-6ee4-452c-9ada-3cc922b630ec.png)

## What formatters exists?

There is two types of formatters:

- `lines` adds links to each line;
- `files` shows information in table;

You can choose formatter with `ESCOVER_FORMAT` env variable.

## Env

If you want to disable coverage on status code without erroring, use `ESCOVER_SUCCESS_EXIT_CODE`:

```js
import {SKIPPED} from 'supertape/exit-codes';

const env = {
    ESCOVER_SUCCESS_EXIT_CODE: SKIPPED,
};

export default {
    test: () => [env, `escover tape 'test/**/*.js' 'lib/**/*.spec.js'`],
};
```

## What should I know about `lcov`?

Format used by 🎩**ESCover** located in `coverage/lcov.info`.

- ☝️ *[`lcov`](https://github.com/linux-test-project/lcov) was created in `2002`, twenty years ago.*
- ☝️ *Linux kernel developers created it to know what is going on with the coverage.*
- ☝️ *It's written in `PERL` and has text based format.*
- ☝️ *This is most popular coverage format of all times supported by a lot of tools (like [coveralls](https://coveralls.io)).*

When you run your `ESM` application with:

```sh
escover npm test
```

You will receive something similar to:

```sh
SF:/Users/coderaiser/escover/lib/transform.js
DA:1,1
DA:3,1
DA:7,1
DA:9,1
DA:10,1
DA:12,1
DA:24,1
DA:25,1
DA:27,1
DA:28,1
DA:29,1
DA:32,1
end_of_record
```

Where:

- `SF` - is path to source;
- `DA` - is line number, and count of running;
- `end_of_record` latest recorded for current file entry;

The only thing that is differ from `lcov`: counters are `0` or `1`, if you have a reason to use "real" counters [create an issue](https://github.com/coderaiser/escover/issues/new).

It can be added in one line of code, but I see no reason why it can be useful 🤷‍♂️.

## License

MIT
