# 🎩`ESCover` [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL] [![Coverage Status][CoverageIMGURL]][CoverageURL]

[NPMIMGURL]: https://img.shields.io/npm/v/escover.svg?style=flat
[BuildStatusURL]: https://github.com/coderaiser/escover/actions?query=workflow%3A%22Node+CI%22 "Build Status"
[BuildStatusIMGURL]: https://github.com/coderaiser/escover/workflows/Node%20CI/badge.svg
[LicenseIMGURL]: https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[NPMURL]: https://npmjs.org/package/escover "npm"
[LicenseURL]: https://tldrlegal.com/license/mit-license "MIT License"
[CoverageURL]: https://coveralls.io/github/coderaiser/escover?branch=master
[CoverageIMGURL]: https://coveralls.io/repos/coderaiser/escover/badge.svg?branch=master&service=github

Coverage for EcmaScript Modules based on 🐊[`Putout`](https://github.com/coderaiser/putout) and [loaders](https://nodejs.org/dist/latest-v16.x/docs/api/esm.html#loaders).

## Why another coverage tool?

When you want to use `ESM` in `Node.js` without transpiling to `CommonJS` (that's what `jest`, `ava`, `tap` does),
you have a couple problems to solve.

### 🤷‍ What test runner does no transpiling to `CommonJS`?

☝️ that's easy! 📼 [`Supertape`](https://github.com/coderaiser/supertape) supports `ESM` from the box;

### 🤷‍  How to mock modules without [mock-require](https://github.com/boblauer/mock-require) (we in `ESM`!);

☝️ that's solved! [`mock-import`](https://github.com/coderaiser/mock-import) does the thing using `loaders`;

### 🤷‍ How to get coverage when `nyc` doesn't supported?

☝️ `c8` could help, but [no](https://github.com/coderaiser/c8-reproduce) it supports no `query paramters`
which are needed to load module again, and apply mocks.

### 🤷‍  How to get coverage when mocks are used?

☝️ Use 🎩 `ESCover`! It supports loaders, `ESM` and collects coverage as a loader!

## Install

```
npm i escover -D
```

Run to collect and show coverage:

```sh
escover npm test
```

## Config

`exclude` section of configuration file `.nyrc.json` supported.

## How it looks like?

When everything is covered:

![image](https://user-images.githubusercontent.com/1573141/149822261-ff9bc3b4-6ee4-452c-9ada-3cc922b630ec.png)

## What if I want to use 🎩`ESCover` with `mock-import`?

Experimental `loaders` supports only one, for now. So [zenload](https://github.com/coderaiser/zenload) should be used.

Install it with:

```sh
npm i escover mock-import zenload
```

Then run:

```sh
NODE_OPTIONS="'--loader zenlend'" ZENLOAD='escover,mock-import' escover npm test
```

This configuration will add coverage collectors and then apply mocks with help of `mock-import`.
Of course the most comfortable way of doing this things will be [madrun](https://github.com/coderaiser/madrun).
Run you `package-scripts` in `JavaScript` :)!

## License

MIT
