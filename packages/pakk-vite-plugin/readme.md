# [vite-plugin-pakk](https://github.com/AlexAegis/js-tooling/tree/master/packages/pakk-vite-plugin/)

[![Latest NPM Version](https://img.shields.io/npm/v/vite-plugin-pakk/latest)](https://www.npmjs.com/package/vite-plugin-pakk)
[![ci](https://github.com/AlexAegis/js-tooling/actions/workflows/cicd.yml/badge.svg)](https://github.com/AlexAegis/js-tooling/actions/workflows/cicd.yml)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/6863e4f702e34f4ea54dc05d71acfe7b)](https://www.codacy.com/gh/AlexAegis/js-tooling/dashboard?utm_source=github.com&utm_medium=referral&utm_content=AlexAegis/js-tooling&utm_campaign=Badge_Grade)
[![codecov](https://codecov.io/github/AlexAegis/js-tooling/branch/master/graph/badge.svg?token=OUxofr6zE8)](https://codecov.io/github/AlexAegis/js-tooling)

A vite plugin to fill out your `package.json` files for its local and published
variants.

## Usage

Add it to the `plugins` array in your `vite.config.ts` file!

> It is also wrapping
> [vite-plugin-dts](https://github.com/qmhc/vite-plugin-dts)!

```ts
import { defineConfig } from 'vite';
import { pakk } from 'vite-plugin-pakk';

export default defineConfig({
  plugins: [pakk()],
});
```

## Features

- Sets up exports automatically from the top level files in your library.
  `index.ts` will be treated as the default export, and any additional files
  will be treated as other entry points. This means you have to put every other
  internal file in a directory!
  - Sets up exports for both ES Modules and CommonJS!
  - It fills your local `package.json` file too! For `types` it will point to
    your internal typescript file (`./src/index.ts`) but for the actual code, it
    will point to your `outDir` (`./dist/index.js`). This ensures that you build
    and test with the actual build artifact, but let's you see changes
    immediately! (It assumes your build and test tools build dependencies before
    building or testing any package!)
  - It adjusts the distributed `package.json` file so it points to the correct
    paths for both types (`./index.d.ts`) and ESM/CJS files (`./index.js`,
    `./index.cjs`)
- Files in a folder called `bin` will be treated as bins for the package. Shims
  and bin entries will automatically be created to allow them to be used locally
  too, not to disturb package managers like `pnpm` when they create symlinks.
- You can set up a `static` folder next to `src` too to export non-js files like
  the docs or images.
- Opinionated, but highly configurable! It works out-of-the box using these
  conventional locations, but almost every aspect of it is configurable.
  Directories can be adjusted, file globs can be added
- This plugin **does not generate type definition files!** It assumes you have a
  `dts` generator plugin present!
