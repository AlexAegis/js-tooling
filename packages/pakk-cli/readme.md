# [pakk](https://github.com/AlexAegis/js-tooling/tree/master/packages/cli/)

[![Latest NPM Version](https://img.shields.io/npm/v/pakk/latest)](https://www.npmjs.com/package/pakk)
[![ci](https://github.com/AlexAegis/js-tooling/actions/workflows/cicd.yml/badge.svg)](https://github.com/AlexAegis/js-tooling/actions/workflows/cicd.yml)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/6863e4f702e34f4ea54dc05d71acfe7b)](https://www.codacy.com/gh/AlexAegis/js-tooling/dashboard?utm_source=github.com&utm_medium=referral&utm_content=AlexAegis/js-tooling&utm_campaign=Badge_Grade)
[![codecov](https://codecov.io/github/AlexAegis/js-tooling/branch/master/graph/badge.svg?token=OUxofr6zE8)](https://codecov.io/github/AlexAegis/js-tooling)

This packages exposes pakk to be used on it's own, preferably after another tool
built your library. At this point this cli will adjust both your `source` and
`dist` packageJson files.

> By using pakk like this you are expected to ensure your build tool emits the
> output the same way pakk generates the package.json.

If you're using [`vite`](https://vitejs.dev/) as your build tool I recommend
using the vite plugin form of this tool:
[`vite-plugin-pakk`](../pakk-vite-plugin/)
