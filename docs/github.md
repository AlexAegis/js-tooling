# Github

## Services

### Pages

- Go to <https://github.com/AlexAegis/js/settings/pages> and set `Source` to
  `Github Actions`

### Publishing packages on NPM

- Create a new automation token at
  <https://www.npmjs.com/settings/alexaegis/tokens/new>
- Go to <https://github.com/AlexAegis/js/settings/secrets/actions> and add this
  token as `NPM_TOKEN`

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

### Codecov

- Generate a token at <https://app.codecov.io/account/github/AlexAegis/access>
- Go to <https://github.com/AlexAegis/js/settings/secrets/actions> and add this
  token as `CODECOV_TOKEN`
