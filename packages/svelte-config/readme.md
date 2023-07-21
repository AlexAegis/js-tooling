# [@alexaegis/svelte-config](https://github.com/AlexAegis/js-tooling/tree/master/packages/svelte-config)

[![npm](https://img.shields.io/npm/v/@alexaegis/svelte-config/latest)](https://www.npmjs.com/package/@alexaegis/svelte-config)
[![ci](https://github.com/AlexAegis/js-tooling/actions/workflows/cicd.yml/badge.svg)](https://github.com/AlexAegis/js-tooling/actions/workflows/cicd.yml)
[![codacy](https://app.codacy.com/project/badge/Grade/7939332dc9454dc1b0529e720ff902e6)](https://www.codacy.com/gh/AlexAegis/js-tooling/dashboard?utm_source=github.com&utm_medium=referral&utm_content=AlexAegis/js-tooling&utm_campaign=Badge_Grade)

## Why isn't this package written in TypeScript?

This package is written in JavaScript with JSDoc instead of TS, to not interfere
with the example sveltekit project here that tries to call `svelte-kit sync` on
postinstall. That's the only reason.
