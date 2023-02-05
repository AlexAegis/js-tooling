# [js-tooling](https://github.com/AlexAegis/js-tooling)

> **nickel** (core)

[![npm](https://img.shields.io/npm/v/@alexaegis/ts/latest)](https://www.npmjs.com/package/@alexaegis/ts)
[![ci](https://github.com/AlexAegis/js-tooling/actions/workflows/ci.yml/badge.svg)](https://github.com/AlexAegis/js-tooling/actions/workflows/ci.yml)
[![codacy](https://app.codacy.com/project/badge/Grade/7939332dc9454dc1b0529e720ff902e6)](https://www.codacy.com/gh/AlexAegis/js-tooling/dashboard?utm_source=github.com&utm_medium=referral&utm_content=AlexAegis/js-tooling&utm_campaign=Badge_Grade)

Base repo for common stuff in my other js projects, the solutions these provide
are mostly pretty rigid and heavily opinionated but the concept is not. This is
not a template repository!

> If you wish to have something like this yourself, fork this repo!

## setup and non-setup packages

Every `setup-*` package's job is to distribute files and `package.json` entries
in the workspace on `postinstall`. If a setup has some unique dependencies like
an `eslint` or `ts` config, those are from a separate package, so they can be
used without the "auto-distributor".

## config providers

- [editorconfig](packages/editorconfig/)
- [eslint-config-core](packages/eslint-config-core/)
- [eslint-config-svelte](packages/eslint-config-svelte/)
- [git](packages/git/)
- [husky](packages/husky/)
- [prettier](packages/prettier/)
- [stylelint](packages/stylelint/)
- [tsconfig](packages/tsconfig/)
- [turbo](packages/turbo/)
- [vite](packages/vite/)
- [vitest](packages/vitest/)

## cli tools

These are either help config providers function or help manage a workspace

- [tools](packages/tools/)
- [nuke](packages/nuke/)

## bundles

Packages bundling other packages together

- [dev](packages/dev/)

## Assumptions

> maybe these could be turned into lints?

- `ci.yml`
  - Package names match the folders they're in. (`@org/foo` is in a folder
    called `foo`)
  - Every package is either under the same `@org` or in none

## Repository setup guide

1. Put it together
2. Done

### When using [`turbo`](packages/turbo/)

```sh
npx turbo link
```
