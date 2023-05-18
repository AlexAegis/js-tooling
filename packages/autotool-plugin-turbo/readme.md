# [@alexaegis/autotool-plugin-turbo](https://github.com/AlexAegis/js-tooling/tree/master/packages/autotool-plugin-turbo)

[![npm](https://img.shields.io/npm/v/@alexaegis/autotool-plugin-turbo/latest)](https://www.npmjs.com/package/@alexaegis/autotool-plugin-turbo)
[![ci](https://github.com/AlexAegis/js-tooling/actions/workflows/cicd.yml/badge.svg)](https://github.com/AlexAegis/js-tooling/actions/workflows/cicd.yml)
[![codacy](https://app.codacy.com/project/badge/Grade/7939332dc9454dc1b0529e720ff902e6)](https://www.codacy.com/gh/AlexAegis/js-tooling/dashboard?utm_source=github.com&utm_medium=referral&utm_content=AlexAegis/js-tooling&utm_campaign=Badge_Grade)

## Conventional hooks

The aim is to use a single, catch-all `turbo.json` config. This is hard because
sometimes packages have unique dependencies. For example linting can be done
without building the packages. Well, in a regular project yes but if your lint
configuration itself is a local build artifact, that one has to be built first.
This is a very unique requirement, for which you have a few options to remedy:

- You can make a unique `pre<task>` task that's only present for that package
  > This is what I have for `build`. This has the drawback of having to redefine
  > the same script. If your `build` script for example had a more complicated
  > command, now you have to make sure it's the same at the `prebuild` scripts
  > too. The only reason I do this, is because the only other viable solution
  > can't be used to "require" the same kind of tasks. More on them in the
  > [Require Tasks](./readme.md#require-tasks) section.
- ~~Or a workspace level "chain" task that calls another turbo task~~
  > Calling turbo from a turbo task became disallowed around `turbo@1.9`
- Or chain tasks using `<source>:require:<target>` style tasks where you need
  them.
  > This is a very flexible solution, but it cannot require itself, that would
  > result in a circle! More on them in the
  > [Require Tasks](./readme.md#require-tasks) section.

### Require Tasks

Sometimes a package needs another one to complete a task before in a very unique
fashion. For these situations it's troublesome to create unique tasks and
declare unique dependencies. So I came up with `require` tasks. Their task
declaration are always the same:

```json
{
  "pipeline": {
    "<source>:require:<target>": {
      "env": [],
      "dependsOn": ["<target>"],
      "outputs": [],
      "outputMode": "new-only"
    }
  }
}
```

The `<source>` is what needs a few `<target>` to finish first if this
`<source>:require:<target>` task is declared on those few packages. The content
is always the same, the only dependency is the `<target>` task.

You also need to depend on the `<source>:require:<target>` task from the
`<source>` task. You should add both the **same-package** and **parent-package**
variants like so:

```json
{
  "pipeline": {
    "<source>": {
      "dependsOn": ["^<source>:require:<target>", "<source>:require:<target>"],
      "outputMode": "new-only"
    }
  }
}
```

As you can see, while it's flexible, it's not universal, you could declare
require tasks between any two tasks, and that would quickly add up. I recommend
you only adding what you need. Here, the only require scripts are requiring
packages to be built.

#### The `<source>` and `<target>` can't be the same

When you need one package to be built first before anything else is built, and
it's unrelated to the actual dependency graph between them.

This would result in a circle, and an error like this:

```sh
 ERROR  run failed: error preparing engine: Invalid task dependency graph:
cyclic dependency detected:
        ___ROOT___#build-lib:require:build-lib_,___ROOT___#build-lib_
        @alexaegis/vite#build-lib_,@alexaegis/vite#build-lib:require:build-lib_
        @alexaegis/vitest#build-lib:require:build-lib_,@alexaegis/vitest#build-lib_
```

If you are ever in a situation like this, you need unique, duplicate scripts. In
this repository, this is the [`@alexaegis/vite`](../vite/) package. The build
artifact of this package is the build configuration that every `vite` based
build uses here. It can build itself just fine, but others need the config to be
built.

This is solved here with a `prebuild` task, that is a requirement of `build`

#### What's the point?

Normally if a task is a dependency of another you just mark it as a dependency.
For example, linting the stylesheets does not depend on anything, it's static
analysis. But, in this repository here, lives the package for my stylelint
config, and the config is the build artifact of
[@alexaegis/stylelint-config](../stylelint-config/).

This is not true in other repositories as they get the built artifact from
`npm`, but in this repository it has to be built first. And this is the only
package that has to be built before running `stylelint` so declaring `build` as
a dependency of `lint:style` would be a huge waste.

The `require` tasks solve this. I can add a requirement on specific packages by
adding an empty script into them. In this repository here,
[stylelint-config's package.json](../stylelint-config/package.json) has such a
script.

```json
{
  "name": "@alexaegis/stylelint-config",
  "scripts": {
    "lint:style:require:build-lib_": "# chain"
  }
}
```

As you can see it's just a comment, but this does tell `turbo` that before
running any kind of `lint:style` tasks, the `build-lib_` task here, and here
only has to complete first.

### Task postfixes

Tasks are postfixed with an `_` so npm scripts that call `turbo` are clearly
separated from the ones that contain the actual implementation of that script.
This allows defining tasks inside the individial packages that call `turbo`
filtering to that package only. You shouldn't use the internal task
implementation of a package because that doesn't ensure that dependencies are
met.
