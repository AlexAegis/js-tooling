# `tsconfig`

These are base shared `tsconfig.json`s from which all other `tsconfig.json`'s
inherit from.

TODO: Create a tsconfig.json at the root of the repo at postinstall

## Info about some options

### `"moduleResolution": "nodenext",`

Very important for interop with ES Modules. When importing a locally bundled
dependency, using 'node' would try to import cjs modules from es
modules,resulting in a runtime error.

### `"target": "es2020",`

In vite projects this is not used, make sure that the vite config uses the
target that you want
