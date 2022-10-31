# Setup

## Repositories

Monorepos are great but if you develop your own `devDependencies` that are also
consuming your other packages as `dependencies` you can very easily encounter a
circular dependency.

But you can break this circle by turning one of these local packages into a
remote one by publishing it to a repository.

When installing locally, `devDependencies` are resolved, but when installing a
remote package, its `devDependencies` are not, breaking the circle.

### A note about using a vite package to build itself

See [vite/readme.md](../packages/vite/readme.md)
