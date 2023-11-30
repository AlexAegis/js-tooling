# [js-tooling](https://github.com/AlexAegis/js-tooling)

[![npm](https://img.shields.io/npm/v/@alexaegis/ts/latest)](https://www.npmjs.com/package/@alexaegis/ts)
[![ci](https://github.com/AlexAegis/js-tooling/actions/workflows/cicd.yml/badge.svg)](https://github.com/AlexAegis/js-tooling/actions/workflows/cicd.yml)
[![codacy](https://app.codacy.com/project/badge/Grade/7939332dc9454dc1b0529e720ff902e6)](https://www.codacy.com/gh/AlexAegis/js-tooling/dashboard?utm_source=github.com&utm_medium=referral&utm_content=AlexAegis/js-tooling&utm_campaign=Badge_Grade)

Repository containing tooling configurations for my JS repositories. The
solutions provided here are pretty rigid and are heavily opinionated.

## config providers

These packages only contain configurations, that could be independently used

- [commitlint-config](packages/commitlint-config/)
- [eslint-config-core](packages/eslint-config-core/)
- [eslint-config-vitest](packages/eslint-config-vitest/)
- [lint-staged-config](packages/lint-staged-config/)
- [prettier-config](packages/prettier-config/)
- [remark-preset](packages/remark-preset/)
- [standard-version](packages/standard-version/)
- [stylelint-config](packages/stylelint-config/)
- [ts](packages/ts/)
- [turbowatch](packages/turbowatch/)
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
- [autotool-plugin-github](packages/autotool-plugin-github/)
- [autotool-plugin-husky](packages/autotool-plugin-husky/)
- [autotool-plugin-prettier](packages/autotool-plugin-prettier/)
- [autotool-plugin-publint](packages/autotool-plugin-publint/)
- [autotool-plugin-remark](packages/autotool-plugin-remark/)
- [autotool-plugin-standard-version](packages/autotool-plugin-standard-version/)
- [autotool-plugin-stylelint](packages/autotool-plugin-stylelint/)
- [autotool-plugin-svelte](packages/autotool-plugin-svelte/)
- [autotool-plugin-ts](packages/autotool-plugin-ts/)
- [autotool-plugin-turbo](packages/autotool-plugin-turbo/)
- [autotool-plugin-typedoc](packages/autotool-plugin-typedoc/)
- [autotool-plugin-vite](packages/autotool-plugin-vite/)
- [autotool-plugin-vitest](packages/autotool-plugin-vitest/)
- [autotool-plugin-vscode](packages/autotool-plugin-vscode/)
- [autotool-plugin-workspace](packages/autotool-plugin-workspace/)

## cli tools

These are either help config providers function or help manage a workspace

- [nuke](packages/nuke/)
