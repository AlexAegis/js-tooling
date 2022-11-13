# Github

## Services

### CI

- Create a `ci.yml` file based on the one [here](../.github/workflows/ci.yml)
- Replace the `artifacts` array at the `publish` step to filter out what you
  want to publish on npm
- Once it ran once, add a badge displaying its status on your
  [`readme.md`](../readme.md) file from
  <https://github.com/AlexAegis/js/actions/workflows/ci.yml>, click on the
  `Create status badge` option in the menu. (Or modify the one you found here by
  hand)

### Pages

- Go to <https://github.com/AlexAegis/js/settings/pages> and set `Source` to
  `Github Actions`

### Publishing packages on NPM

- Create a new automation token at
  <https://www.npmjs.com/settings/alexaegis/tokens/new>
- Go to <https://github.com/AlexAegis/js/settings/secrets/actions> and add this
  token as `NPM_TOKEN`
- Add a release version badges to [`readme.md`](../readme.md) files:
  [![Latest NPM Version](https://img.shields.io/npm/v/@alexaegis/js/latest)](https://www.npmjs.com/package/@alexaegis/js)

### Turbo Cache via Vercel

- Go to <https://vercel.com/account/tokens> and create a new token
- Go to <https://github.com/AlexAegis/js/settings/secrets/actions> and add this
  token as `TURBO_TOKEN` and your vercel username as `TURBO_TEAM`

### Codacy

- Add repository on codacy
  <https://app.codacy.com/organizations/gh/AlexAegis/repositories/add>
- Go to your projects Codacy page and on the Coverage tab in Settings you can
  see your Project Token
  <https://app.codacy.com/gh/AlexAegis/js/settings/coverage>
- Go to <https://github.com/AlexAegis/js/settings/secrets/actions> and add this
  token as `CODACY_PROJECT_TOKEN`
- Add badge to repository [`readme.md`](../readme.md) file from
  <https://app.codacy.com/gh/AlexAegis/js/settings>

### Codecov

- Make sure the CodeCov Github app is installed (You don't need a token then)
- Let automation upload a coverage report to Codecov, this will enable it as a
  repository
- Add badge to repository [`readme.md`](../readme.md) file from
  <https://app.codecov.io/github/AlexAegis/js/settings/badge>
