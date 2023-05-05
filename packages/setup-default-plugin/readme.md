# @alexaegis/setup-default-plugin

This plugin provides the default elements, their executors and some validators.

## Provided Element Executors

### PackageJsonElement

Example:

```ts
// Add a build script to the package json, and remove another if exists
{
  type: 'package-json',
  data: {
    scripts: {
      build: 'vite',
      'build-but-legacy': undefined
    }
  }
}

```

Allows you to add or remove elements from a packageJson file. Will also sort it
for you based on a preference.

TODO: Describe the other elements

## Provided Validators

### Elements for root should not target inside packages

Use elements that are executing right at that package
