# [js-tooling](https://github.com/AlexAegis/js-tooling)

> **nickel** (core)

[![npm](https://img.shields.io/npm/v/@alexaegis/ts/latest)](https://www.npmjs.com/package/@alexaegis/ts)
[![ci](https://github.com/AlexAegis/js-tooling/actions/workflows/cicd.yml/badge.svg)](https://github.com/AlexAegis/js-tooling/actions/workflows/cicd.yml)
[![codacy](https://app.codacy.com/project/badge/Grade/7939332dc9454dc1b0529e720ff902e6)](https://www.codacy.com/gh/AlexAegis/js-tooling/dashboard?utm_source=github.com&utm_medium=referral&utm_content=AlexAegis/js-tooling&utm_campaign=Badge_Grade)

Base repo for common stuff in my other js projects, the solutions these provide
are mostly pretty rigid and heavily opinionated but the concept is not. This is
not a template repository!

> If you wish to have something like this yourself, fork this repo!

## config providers

These packages only contain configurations and they don't do anything automatic
like the `setup-*` packages.

- [eslint-config-core](packages/eslint-config-core/)
- [ts](packages/ts/)
- [vite](packages/vite/)
- [vitest](packages/vitest/)

## autotool plugins

Every `autotool-plugin-*` packages job is to distribute files and `package.json`
entries in the workspace on `postinstall`.

- [autotool-plugin-commitlint](packages/autotool-plugin-commitlint/)
- [autotool-plugin-depcheck](packages/autotool-plugin-depcheck/)
- [autotool-plugin-editorconfig](packages/autotool-plugin-editorconfig/)
- [autotool-plugin-eslint](packages/autotool-plugin-eslint/)
- [autotool-plugin-git](packages/autotool-plugin-git/)
- [autotool-plugin-husky](packages/autotool-plugin-husky/)
- [autotool-plugin-prettier](packages/autotool-plugin-prettier/)
- [autotool-plugin-publint](packages/autotool-plugin-publint/)
- [autotool-plugin-remark](packages/autotool-plugin-remark/)
- [autotool-plugin-standard-version](packages/autotool-plugin-standard-version/)
- [autotool-plugin-stylelint](packages/autotool-plugin-stylelint/)
- [autotool-plugin-svelte](packages/autotool-plugin-svelte/)
- [autotool-plugin-turbo](packages/autotool-plugin-turbo/)
- [autotool-plugin-ts](packages/autotool-plugin-ts/)
- [setup-vite](packages/setup-vite/)
- [setup-vitest](packages/setup-vitest/)

### bundles

Packages bundling other packages together

- [setup-workspace](packages/setup-workspace/)

## cli tools

These are either help config providers function or help manage a workspace

- [nuke](packages/nuke/)

### When using [`turbo`](packages/autotool-plugin-turbo/)

To enable remote caching:

```sh
npx turbo link
```
