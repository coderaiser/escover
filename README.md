# 🎩`ESCover` [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL] [![Coverage Status][CoverageIMGURL]][CoverageURL]

[NPMIMGURL]: https://img.shields.io/npm/v/escover.svg?style=flat
[BuildStatusURL]: https://github.com/coderaiser/escover/actions?query=workflow%3A%22Node+CI%22 "Build Status"
[BuildStatusIMGURL]: https://github.com/coderaiser/escover/workflows/Node%20CI/badge.svg
[LicenseIMGURL]: https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[NPMURL]: https://npmjs.org/package/escover "npm"
[LicenseURL]: https://tldrlegal.com/license/mit-license "MIT License"
[CoverageURL]: https://coveralls.io/github/coderaiser/escover?branch=master
[CoverageIMGURL]: https://coveralls.io/repos/coderaiser/escover/badge.svg?branch=master&service=github

Explosive coverage tool

## Install

```
npm i escover -g
```

Then run using:

```sh
NODE_OPTIONS="'--loader escover'" escover npm test
```

## How it looks like?

When everything is covered:

![image](https://user-images.githubusercontent.com/1573141/147943954-ef708577-2856-4de0-9397-dead487b8c08.png)

When some lines missing coverage:

![image](https://user-images.githubusercontent.com/1573141/147944130-9b901646-05ff-4a76-86c9-30631b0a0dd4.png)

## License

MIT
