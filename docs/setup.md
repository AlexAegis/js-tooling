# Setup

## Repositories

Monorepos are great but if you develop your own `devDependencies` that are also
consuming your other packages as `dependencies` you can very easily encounter a
circular dependency.

But you can break this circle by turning one of these local packages into a
remote one by publishing it to a repository.

When installing locally, `devDependencies` are resolved, but when installing a
remote package, its `devDependencies` are not, breaking the circle.

### Sharing configuration

Git submodules vs node packages

Git submodules are not fetched by default so they are only really useful for
optional packages, On the other hand node packages are fetched anyways so
there's no additional friction and as long as these packages are not abrasive -
they don't delete your stuff - and they always settle after one install - they
don't force stuff into your workspace -

> Haven't tried them this way, but in theory if no other package in a monorepo
> is using them it's safe to mark them as "optional" by turning them into a git
> submodule. Since turbo is not pointing to each package directly but use globs,
> it should be fine to omit some

My packages achieve this by only placing stuff in packages where you explicitly
mention them as a `dependency` and not touching existing files.

### A note about using a vite package to build itself

See [vite/readme.md](../packages/vite/readme.md)

### In-repo postinstall scripts

A monorepos package can't have a `postinstall` script that is defined by itself
as `build` can only happen after `install`, but `postinstall` is the first that
happens after `install`. But to run the `build` step, you need to have
everything installed.
