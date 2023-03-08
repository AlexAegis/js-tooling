# [@alexaegis/turbo](https://github.com/AlexAegis/js-tooling/tree/master/packages/turbo)

[![npm](https://img.shields.io/npm/v/@alexaegis/turbo/latest)](https://www.npmjs.com/package/@alexaegis/turbo)
[![ci](https://github.com/AlexAegis/js-tooling/actions/workflows/cicd.yml/badge.svg)](https://github.com/AlexAegis/js-tooling/actions/workflows/cicd.yml)
[![codacy](https://app.codacy.com/project/badge/Grade/7939332dc9454dc1b0529e720ff902e6)](https://www.codacy.com/gh/AlexAegis/js-tooling/dashboard?utm_source=github.com&utm_medium=referral&utm_content=AlexAegis/js-tooling&utm_campaign=Badge_Grade)

## Conventional hooks

The aim is to use a single, catch-all `turbo.json` config. This is hard because
sometimes packages have unique dependencies. For example linting can be done
without building the packages. Well, in a regular project yes but if your lint
configuration itself is a local build artifact, that one has to be built first.
Not only this is a very unique requirement, you can't even specify packages in
the `dependsOn` configuration, only tasks.

You have 2 options to remedy this:

- You can make a unique `pre` task that's only present in that package
- Or a workspace level "chain" task that calls another turbo task

The first is a good choice when there is an actual dependency between packages
but thats not always the case. (For example to use an `eslint` preset, if you
extend your package config from the workspace one, the preset only has to be a
dependency for the workspace. So you can't use the dependency tree to
orchestrate the building of the config itself) The latter allows for arbitrary
dependency between tasks when needed. For the latter to work, cache on that task
needs to be disabled because it doesn't know what to cache, it just calls into
another turbo task. But it doesn't need to know, let's just always call the
inner turbo task and let the cache of that do it's job.

These two are not mutually exclusive so we can have both!

### Tasks

Every task has 6 subtasks, half of which is its workspace variant

- `task_`
- `//#task_`
- `task_:pre`
- `//#task_:pre`
- `task_:chain` with `cache: false`
- `//#task_:chain` with `cache: false`

Tasks are postfixed with an `_` so npm scripts that call `turbo` are clearly
separated from the ones that contain the actual implementation of that script.
This allows defining tasks inside the individial packages that call `turbo`
filtering to that package only. You shouldn't use the internal task
implementation of a package because that doesn't ensure that dependencies are
met.
