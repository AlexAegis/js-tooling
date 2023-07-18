# [@alexaegis/autotool-plugin-turbo](https://github.com/AlexAegis/js-tooling/tree/master/packages/autotool-plugin-turbo)

[![npm](https://img.shields.io/npm/v/@alexaegis/autotool-plugin-turbo/latest)](https://www.npmjs.com/package/@alexaegis/autotool-plugin-turbo)
[![ci](https://github.com/AlexAegis/js-tooling/actions/workflows/cicd.yml/badge.svg)](https://github.com/AlexAegis/js-tooling/actions/workflows/cicd.yml)
[![codacy](https://app.codacy.com/project/badge/Grade/7939332dc9454dc1b0529e720ff902e6)](https://www.codacy.com/gh/AlexAegis/js-tooling/dashboard?utm_source=github.com&utm_medium=referral&utm_content=AlexAegis/js-tooling&utm_campaign=Badge_Grade)

## Goal

The aim is to use a single, catch-all `turbo.json` config. This is hard because
sometimes packages have unique dependencies. For example linting can be done
without building the packages. Well, in a regular project yes but if your lint
configuration itself is a local build artifact, that one has to be built first.
This is a very unique requirement.

To achieve this while not modifying the root `turbo.json` config, your only
option is (unless inverse dependencies become possible) placing an override
`turbo.json` file into every single package.

## Task postfixes

Tasks are postfixed with an `_` so npm scripts that call `turbo` are clearly
separated from the ones that contain the actual implementation of that script.
This allows defining tasks inside the individial packages that call `turbo`
filtering to that package only. You shouldn't use the internal task
implementation of a package because that doesn't ensure that dependencies are
met.

## Notes

### Why does lint:svelte depend on ^build?

svelte-check fails if types can't be resolved for an import, and local library
export types are only available if the library is packaged. `svelte-package`
generates the `.svelte.d.ts` files.

It is advised to only export ts files, and not svelte files becuase of this type
related limitation, but this task dependency is there nontheless to avoid any
possible weird errors during lint:svelte.
