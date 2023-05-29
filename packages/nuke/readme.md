# [@alexaegis/nuke](https://github.com/AlexAegis/js-tooling/tree/master/packages/nuke)

[![npm](https://img.shields.io/npm/v/@alexaegis/nuke/latest)](https://www.npmjs.com/package/@alexaegis/nuke)
[![ci](https://github.com/AlexAegis/js-tooling/actions/workflows/cicd.yml/badge.svg)](https://github.com/AlexAegis/js-tooling/actions/workflows/cicd.yml)
[![codacy](https://app.codacy.com/project/badge/Grade/7939332dc9454dc1b0529e720ff902e6)](https://www.codacy.com/gh/AlexAegis/js-tooling/dashboard?utm_source=github.com&utm_medium=referral&utm_content=AlexAegis/js-tooling&utm_campaign=Badge_Grade)

A simple cli command that will attemt to clear a workspace. It can also do
partial cleaning where it keeps your dependencies intact. By default it also
deletes your `node_modules` and `package-lock.json` files too. It also scans
through your workspaces too.

## Options

```sh
--keep-node-modules - skip removing node_modules
```
