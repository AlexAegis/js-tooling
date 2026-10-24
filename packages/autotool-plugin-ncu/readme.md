# [@alexaegis/autotool-plugin-ncu](https://github.com/AlexAegis/js-tooling/tree/master/packages/autotool-plugin-ncu)

[![npm](https://img.shields.io/npm/v/@alexaegis/autotool-plugin-ncu/latest)](https://www.npmjs.com/package/@alexaegis/autotool-plugin-ncu)
[![ci](https://github.com/AlexAegis/js-tooling/actions/workflows/cicd.yml/badge.svg)](https://github.com/AlexAegis/js-tooling/actions/workflows/cicd.yml)
[![codacy](https://app.codacy.com/project/badge/Grade/7939332dc9454dc1b0529e720ff902e6)](https://www.codacy.com/gh/AlexAegis/js-tooling/dashboard?utm_source=github.com&utm_medium=referral&utm_content=AlexAegis/js-tooling&utm_campaign=Badge_Grade)

## `@types/node`

ncu does not upgrade `@types/node`. Its major version follows the minimum Node
version in `engines.node`. `@alexaegis/autotool-plugin-workspace` sets
`engines.node` and the `@types/node` entry of `overrides` in
`pnpm-workspace.yaml`. The `pnpm up` step of the `ncu` script still updates the
lockfile within that range.
