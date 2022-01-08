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

## How it works from the inside?

🎩`ESCover` uses loader which [transforms source code](https://putout.cloudcmd.io/#/gist/4de40f9c945fe987cb9327fe85631f16/71dc364670db2fa6d50e040055a20d142d4d90f7) and saves location of covered and covered blocks.
Save information into a file `coverage.json` and shows report:

![Screen Shot 2022-01-03 at 2 09 05 AM](https://user-images.githubusercontent.com/1573141/147892869-fbccb588-b997-4escovera-a88e-f28a29d2bdd6.png)

## License

MIT
