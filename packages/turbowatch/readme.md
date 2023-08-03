# [@alexaegis/turbowatch](https://github.com/AlexAegis/js-tooling/tree/master/packages/turbowatch)

[![npm](https://img.shields.io/npm/v/@alexaegis/turbowatch/latest)](https://www.npmjs.com/package/@alexaegis/turbowatch)
[![ci](https://github.com/AlexAegis/js-tooling/actions/workflows/cicd.yml/badge.svg)](https://github.com/AlexAegis/js-tooling/actions/workflows/cicd.yml)
[![codacy](https://app.codacy.com/project/badge/Grade/7939332dc9454dc1b0529e720ff902e6)](https://www.codacy.com/gh/AlexAegis/js-tooling/dashboard?utm_source=github.com&utm_medium=referral&utm_content=AlexAegis/js-tooling&utm_campaign=Badge_Grade)

Holds a configuration for [`turbowatch`](https://github.com/gajus/turbowatch) to
watch local dependencies changing through `node_modules`.

It will first run `buildDependenciesScript`, then after that's finished the
first time, it will run `devScript`.

## Turbowatch configuration example

> `apps/my-app/dev.js`

```js
import { turbowatchLocalNodeModules } from '@alexaegis/turbowatch';
import { watch } from 'turbowatch';

void (async () => {
  await watch(
    await turbowatchLocalNodeModules({
      buildDependenciesScript: 'build:dependencies',
      devScript: 'dev_',
    }),
  );
})();
```

> It's using an IIFE because turbowatch does not understand top-level awaits

## Turbo example

When using with turbo, it's important that `turbo` cannot invoke itself. (In
older versions of turbo it was allowed but worked wonky, since then it's
actively prohibited) So when starting your app, start the invokation from
`turbowatch`

> `apps/my-app/package.json`

```json
{
  "scripts": {
    "build:dependencies": "turbo run build-lib_ --filter my-app",
    "dev": "turbowatch dev.js",
    "dev_": "vite"
  }
}
```

And then the interesting part of a `turbo.json`. For the `turbowatch` setup
specifically, only the `build-lib_` task is used. Since `turbowatch` through the
`"build:dependencies"` npm script already takes care of building the
dependencies of the app, there's no need to start the app through `turbo`. For a
more comprehensive `turbo.json` file, check the one in this package's
repository.

> `turbo.json`

```json
{
  "$schema": "https://turborepo.org/schema.json",
  "pipeline": {
    "build-app_": {
      "dependsOn": ["^build-lib_"],
      "outputs": ["dist/**"]
    },
    "build-lib_": {
      "dependsOn": ["^build-lib_"],
      "outputs": ["dist/**"]
    },
    "dev_": {
      "cache": false,
      "dependsOn": ["^build-lib_"],
      "persistent": true
    }
  }
}
```

> I'm using separate build tasks for apps and libs, so I can skip building the
> app when I'm running `turbo run build-lib_ --filter my-app`, if they'd use the
> same script, the app would get built every time a dependency changes.

You then start your app using the `"dev"` script. You can put one in your root
`package.json` too, but do not forget that you can't use `turbo` for this!

> `package.json`

```json
{
  "script": {
    "dev": "pnpm run --dir apps/my-app dev"
  }
}
```
