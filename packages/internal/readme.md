# internal

This is a non-published, non-buildable library intended to house some utility
functions (that are all re-exported in publishable libraries like `tools` and
`prettier`)

The point is to resolve some circular dependencies between `vite` and
`prettier`.

## About internal packages

- Must not contain a build step, other packages will build and bundle them
- Since it's not buildable, it cannot be published either.
