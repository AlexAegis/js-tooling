# [@alexaegis/ts](https://github.com/AlexAegis/js-tooling/tree/master/packages/ts)

[![npm](https://img.shields.io/npm/v/@alexaegis/ts/latest)](https://www.npmjs.com/package/@alexaegis/ts)
[![ci](https://github.com/AlexAegis/js-tooling/actions/workflows/cicd.yml/badge.svg)](https://github.com/AlexAegis/js-tooling/actions/workflows/cicd.yml)
[![codacy](https://app.codacy.com/project/badge/Grade/7939332dc9454dc1b0529e720ff902e6)](https://www.codacy.com/gh/AlexAegis/js-tooling/dashboard?utm_source=github.com&utm_medium=referral&utm_content=AlexAegis/js-tooling&utm_campaign=Badge_Grade)

These are base shared `tsconfig.json`s from which all other `tsconfig.json`'s
inherit from.

> The exposed `tsconfig.json` files are in the root of this package and not
> inside `src` or `static` because I want to use them in the host repository of
> this project too. And typescript doesn't care if I expose these using
> `exports`. No, the `extends` field in `tsconfig` is just a path from the
> package, so they have to match in the source and the distributed package too.

## Info about some options

### `"moduleResolution": "nodenext",`

Very important for interop with ES Modules. When importing a locally bundled
dependency, using 'node' would try to import cjs modules from es modules,
resulting in a runtime error.

TODO: Explore `"moduleResolution": "bundler",`

### `"target": "es2020",`

In vite projects this is not used, make sure that the vite config uses the
target that you want

### No `include` or `files` field

When both of these options are missing typescript will just import everything it
can within its folder except what you're excluding. And that's exactly what we
need.

## Development Troubleshooting

> For potential issues while developing this package. These are no concerns of
> the consumer.

```sh
error during build:
TSConfckParseError: failed to resolve "extends":"@alexaegis/ts/node" in js-tooling/packages/ts/tsconfig.json
```

This package consumes itself for building. Its `tsconfig` is using definitions
defined within this plugin so if the package gets malformed like `exports` gets
removed from this package.json, then it will fail to build. As long as the
tsconfigs exported here are valid, and they are exported it will be fine.
