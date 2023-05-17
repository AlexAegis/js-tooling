# [@alexaegis/autotool-plugin-prettier](https://github.com/AlexAegis/js-tooling/tree/master/packages/autotool-plugin-prettier)

[![npm](https://img.shields.io/npm/v/@alexaegis/autotool-plugin-prettier/latest)](https://www.npmjs.com/package/@alexaegis/autotool-plugin-prettier)
[![ci](https://github.com/AlexAegis/js-tooling/actions/workflows/cicd.yml/badge.svg)](https://github.com/AlexAegis/js-tooling/actions/workflows/cicd.yml)
[![codacy](https://app.codacy.com/project/badge/Grade/7939332dc9454dc1b0529e720ff902e6)](https://www.codacy.com/gh/AlexAegis/js-tooling/dashboard?utm_source=github.com&utm_medium=referral&utm_content=AlexAegis/js-tooling&utm_campaign=Badge_Grade)

This plugin provides a very opinionated `.prettierrc` and a `.prettierignore`
definition. Upon installing it it will copy `.prettierrc` and `.prettierignore`
into the root of your workspace and `.prettierignore` will also be copied to all
your workspace folders where there isn't. If any of these files are already
defined, it will only overwrite them if they are marked.

## Why is there a `.prettierignore` in every package?

> TODO: <https://github.com/prettier/prettier/issues/4081> Once this issue is
> resolved, change this plugin from adding these prettierignore files to
> removing them.

When running prettier in a subpackage, it can walk upwards the directory
structure to find its configuration. Stangely enough it can't do the same thing
for `.prettierignore` files.
