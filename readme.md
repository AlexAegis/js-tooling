# js

Base repo for common stuff in my other js projects, the solutions these provide
are mostly pretty rigid and heavily opinionated but the concept is not. This is
not a template repository!

> If you wish to have something like this yourself, fork this repo!

## config providers

- [editorconfig](packages/editorconfig/)
- [eslint-config-core](packages/eslint-config-core/)
- [eslint-config-svelte](packages/eslint-config-svelte/)
- [git](packages/git/)
- [husky](packages/husky/)
- [prettier](packages/prettier/)
- [stylelint](packages/stylelint/)
- [tsconfig](packages/tsconfig/)
- [turbo](packages/turbo/)
- [vite](packages/vite/)
- [vitest](packages/vitest/)

## cli tools

These are either help config providers function or help manage a workspace

- [tools](packages/tools/)
- [nuke](packages/nuke/)

## bundles

Packages bundling other packages together

- [dev](packages/dev/)

## Assumptions

> maybe these could be turned into lints?

- `ci.yml`
  - Package names match the folders they're in. (`@org/foo` is in a folder
    called `foo`)
  - Every package is either under the same `@org` or in none

## Repository setup guide

1. Put it together
2. Done

### When using [`turbo`](packages/turbo/)

```sh
npx turbo link
```
