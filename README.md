# 🧨`C4` [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL] [![Coverage Status][CoverageIMGURL]][CoverageURL]

[NPMIMGURL]: https://img.shields.io/npm/v/c4.svg?style=flat
[BuildStatusURL]: https://github.com/coderaiser/c4/actions?query=workflow%3A%22Node+CI%22 "Build Status"
[BuildStatusIMGURL]: https://github.com/coderaiser/c4/workflows/Node%20CI/badge.svg
[LicenseIMGURL]: https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[NPMURL]: https://npmjs.org/package/c4 "npm"
[LicenseURL]: https://tldrlegal.com/license/mit-license "MIT License"
[CoverageURL]: https://coveralls.io/github/coderaiser/c4?branch=master
[CoverageIMGURL]: https://coveralls.io/repos/coderaiser/c4/badge.svg?branch=master&service=github

Explosive coverage tool

## Install

```
npm i c4 -g
```

Then run using:

```sh
NODE_OPTIONS="'--loader c4'" c4 npm test
```

## How it works?

🧨`C4` uses loader which [transforms source code](https://putout.cloudcmd.io/#/gist/4de40f9c945fe987cb9327fe85631f16/71dc364670db2fa6d50e040055a20d142d4d90f7) and saves location of covered and covered blocks.
Save information into a file `coverage.json` and shows report:

![Screen Shot 2022-01-03 at 2 09 05 AM](https://user-images.githubusercontent.com/1573141/147892869-fbccb588-b997-4c4a-a88e-f28a29d2bdd6.png)

Before:

```js
const a = () => {
    a = 5;
     console.log(5);
};


function x() {

    if (a > 2)a()
    else b();
}

for (const x of y) {
}

```

After:

```js
const a = () => {
    __c4.setLine(1);
    a = 5;
    console.log(5);
};


function x() {
    __c4.setLine(7);

    if (a > 2) {
        __c4.setLine(9);
        a();
    } else {
        __c4.setLine(10);
        b();
    }
}

for (const x of y) {
    __c4.setLine(13);
}
```
## License

MIT
