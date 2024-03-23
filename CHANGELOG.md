# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [0.10.1](https://github.com/AlexAegis/js-tooling/compare/v0.10.0...v0.10.1) (2024-03-23)


### Features

* **autotool-plugin-github:** updated github actions to node20 versions ([5045094](https://github.com/AlexAegis/js-tooling/commit/504509434f756367d92553dc1d881fd914c1157a))

## [0.10.0](https://github.com/AlexAegis/js-tooling/compare/v0.9.3...v0.10.0) (2024-03-23)


### Features

* **autotool-plugin-ncu:** updated locked package versions ([4cb4339](https://github.com/AlexAegis/js-tooling/commit/4cb433983e8a257c3ba20958cde495c5d9f4281c))

## [0.9.3](https://github.com/AlexAegis/js-tooling/compare/v0.9.2...v0.9.3) (2024-02-09)


### Features

* add back @sveltejs/vite-plugin-svelte ([af6b47f](https://github.com/AlexAegis/js-tooling/commit/af6b47f54751d7a30ccbd618e0b85e748c5ff722))
* add examples as a workspace folder ([81d8de1](https://github.com/AlexAegis/js-tooling/commit/81d8de1eb23091a9e11afda1fc59d11bc686b431))
* add git preferences for rust ([8aab851](https://github.com/AlexAegis/js-tooling/commit/8aab851e0087b2777f5fefe59af062763e3d274e))
* **autotool-plugin-github:** enable lfs and submodules ([b653b40](https://github.com/AlexAegis/js-tooling/commit/b653b40f92ee2a6a0e1deff6a4a6e21682f9b09d))
* use esm by default ([afad68a](https://github.com/AlexAegis/js-tooling/commit/afad68adb069ed2f48b19bc777477f12caf17ce4))


### Bug Fixes

* default to node for unknown package archetypes ([329e70c](https://github.com/AlexAegis/js-tooling/commit/329e70c7448cbb00151997c1d186b0cd5b77e984))

## [0.9.2](https://github.com/AlexAegis/js-tooling/compare/v0.9.1...v0.9.2) (2023-12-14)


### Features

* ignore vitepress cache with prettier ([5d02caa](https://github.com/AlexAegis/js-tooling/commit/5d02caae09cc6e251f9a6a267086f5d607b61bc6))
* updated vscode settings ([f09c133](https://github.com/AlexAegis/js-tooling/commit/f09c133149b81a00c35dfd2af2b613be05b38460))

## [0.9.1](https://github.com/AlexAegis/js-tooling/compare/v0.9.0...v0.9.1) (2023-11-30)


### Features

* **eslint-config-core:** disabled array reduce ban ([9842bbc](https://github.com/AlexAegis/js-tooling/commit/9842bbcd0e2670351a62fbf4be7b46fda6f481f3))


### Bug Fixes

* **eslint-config-core:** disabled buggy eslint rule ([22bf9ce](https://github.com/AlexAegis/js-tooling/commit/22bf9ceb1bd0943d1a08807041028226dcf99cad))

## [0.9.0](https://github.com/AlexAegis/js-tooling/compare/v0.8.4...v0.9.0) (2023-11-30)

## [0.8.4](https://github.com/AlexAegis/js-tooling/compare/v0.8.3...v0.8.4) (2023-11-13)

## [0.8.3](https://github.com/AlexAegis/js-tooling/compare/v0.8.2...v0.8.3) (2023-10-09)


### Features

* **eslint-config-core:** disabled unicorn/no-array-for-each,  it gives too much false positives ([c0592d7](https://github.com/AlexAegis/js-tooling/commit/c0592d716e504485bc955b89cf1af543d9e15ce7))
* **eslint-config-core:** prefer const should behave better with destructuring ([eee7e75](https://github.com/AlexAegis/js-tooling/commit/eee7e759b350f06dcab55f7c30c908089a28f859))

## [0.8.2](https://github.com/AlexAegis/js-tooling/compare/v0.8.1...v0.8.2) (2023-09-01)

## [0.8.1](https://github.com/AlexAegis/js-tooling/compare/v0.8.0...v0.8.1) (2023-09-01)


### Bug Fixes

* **ts:** synced module an moduleresolution settings ([5565647](https://github.com/AlexAegis/js-tooling/commit/556564746f7fcdce89fe84ac083f93b5bfab1afa))
* **vitest:** removed unnecessary bin for vitest ([7263d72](https://github.com/AlexAegis/js-tooling/commit/7263d729f715c54ba96cb21493f4230d77964ccb))

## [0.8.0](https://github.com/AlexAegis/js-tooling/compare/v0.7.2...v0.8.0) (2023-09-01)

## [0.7.2](https://github.com/AlexAegis/js-tooling/compare/v0.7.1...v0.7.2) (2023-08-19)


### Features

* **autotool-plugin-ts:** add node types for svelte packages too ([55562cc](https://github.com/AlexAegis/js-tooling/commit/55562ccfa54a461d6ea6cfd4ad51c12f7c7990bf))


### Bug Fixes

* downgrade unified-prettier ([62c5ad9](https://github.com/AlexAegis/js-tooling/commit/62c5ad9e8e7e66c498ec53a4ac008c4cc0460054))

## [0.7.1](https://github.com/AlexAegis/js-tooling/compare/v0.7.0...v0.7.1) (2023-08-03)


### Features

* use an abortController in the turbowatcher ([34f65bf](https://github.com/AlexAegis/js-tooling/commit/34f65bf2332d4524f81c559848c8f3a9f9071cb2))

## [0.7.0](https://github.com/AlexAegis/js-tooling/compare/v0.6.3...v0.7.0) (2023-08-03)


### Features

* **turbowatch:** new dependency watching system built on turbowatch ([92b499c](https://github.com/AlexAegis/js-tooling/commit/92b499c2c876ea6dd666ae370416e9b4862530fc))

## [0.6.3](https://github.com/AlexAegis/js-tooling/compare/v0.6.2...v0.6.3) (2023-08-02)


### Features

* **autotool-plugin-depcheck:** added svelte-preprocess to depcheck ignores ([cb05642](https://github.com/AlexAegis/js-tooling/commit/cb0564207f9f697d56e47d0cdc528f86e5adf1cb))
* **autotool-plugin-eslint:** add .vercel to ignored folders ([64cd950](https://github.com/AlexAegis/js-tooling/commit/64cd95007f15fb167807e9a35ee1f384cc7eb6f1))

## [0.6.2](https://github.com/AlexAegis/js-tooling/compare/v0.6.1...v0.6.2) (2023-08-01)


### Features

* **autotool-plugin-svelte:** added node adapter to sveltekit conf ([82793c8](https://github.com/AlexAegis/js-tooling/commit/82793c8c9b24a841e215b6323216b424469c1cce))
* reverted prettier config to use imported plugins instead of strings ([54eec10](https://github.com/AlexAegis/js-tooling/commit/54eec107a2143e623269ad95510c7f1e4e3a7afc))

## [0.6.1](https://github.com/AlexAegis/js-tooling/compare/v0.6.0...v0.6.1) (2023-07-24)


### Features

* **autotool-plugin-depcheck:** added @sveltejs/ deps like adapters to the ignore list ([774800b](https://github.com/AlexAegis/js-tooling/commit/774800b8061f39bbc8e557bc8381be9cf1e45ded))
* **autotool-plugin-svelte:** adapters are now explicitly installed ([9a3afb0](https://github.com/AlexAegis/js-tooling/commit/9a3afb0a1a0fbc3d3046049496cb75b256f04b1d))
* **autotool-plugin-turbo:** add turbo-ignore ([17d8d82](https://github.com/AlexAegis/js-tooling/commit/17d8d82889a484616e98772c039d6689f7e462dd))
* **autotool-plugin-turbo:** mark start and dev as persistent ([fcd634d](https://github.com/AlexAegis/js-tooling/commit/fcd634dcb80ccf7ffac3ceabf1faaf43a5e1f3e0))

## [0.6.0](https://github.com/AlexAegis/js-tooling/compare/v0.5.12...v0.6.0) (2023-07-24)


### Features

* **autotool-plugin-github:** optional codacy report lang override ([bed4c55](https://github.com/AlexAegis/js-tooling/commit/bed4c5535ab58894a3f096afd89495020e698687))
* **autotool-plugin-git:** ignore the .vercel folder ([8221a23](https://github.com/AlexAegis/js-tooling/commit/8221a23695e26a6647c93e85cc08b44c9ddd13c2))
* **autotool-plugin-turbo:** the .vercel folder should be considered output ([95a0efc](https://github.com/AlexAegis/js-tooling/commit/95a0efc38de764daaa7626dc2048fb8da7bbbd7b))
* **eslint-config-svelte:** disable rule conflicting with the new generics feature ([735a6cf](https://github.com/AlexAegis/js-tooling/commit/735a6cf23e5440768c8bc3b93df3b8817a688e20))
* **vite:** added base config for apps ([0900c4f](https://github.com/AlexAegis/js-tooling/commit/0900c4f56dca4cb4f0b642be032c7e7228736823))


### Bug Fixes

* **ts:** allowJs ([68a1f77](https://github.com/AlexAegis/js-tooling/commit/68a1f77a36509e851a1b01ff916366db3f6afdca))

## [0.5.12](https://github.com/AlexAegis/js-tooling/compare/v0.5.11...v0.5.12) (2023-07-22)


### Bug Fixes

* **eslint-config-svelte:** ignore generics related problems ([3996ec2](https://github.com/AlexAegis/js-tooling/commit/3996ec242457491406c9b1ba0543a49d6cfe7fce))

## [0.5.11](https://github.com/AlexAegis/js-tooling/compare/v0.5.10...v0.5.11) (2023-07-22)


### Bug Fixes

* **autotool-plugin-turbo:** publint should not get invalidated all the time ([c989b35](https://github.com/AlexAegis/js-tooling/commit/c989b35e39fc039a2ca67142cd0e0b2a1c5d8555))
* **svelte-config:** manual types ([4fb8bb6](https://github.com/AlexAegis/js-tooling/commit/4fb8bb6a3bbc1acd9cb3bee5bea2dfed368e70f0))

## [0.5.10](https://github.com/AlexAegis/js-tooling/compare/v0.5.9...v0.5.10) (2023-07-21)


### Features

* **autotool-plugin-github:** always build fresh before publishing ([46d10c5](https://github.com/AlexAegis/js-tooling/commit/46d10c571d741d1ecf388240e4b771417eb95cc5))


### Bug Fixes

* **autotool-plugin-github:** making BUILD_REASON publish for the entire pipeline ([ca7855c](https://github.com/AlexAegis/js-tooling/commit/ca7855c3831e89054046fdc69043fb13893ba9aa))
* **autotool-plugin-turbo:** fix output globs ([a0b02bd](https://github.com/AlexAegis/js-tooling/commit/a0b02bd619e1c8db26bed66cb50abf6778b6fa86))
* **autotool-plugin-turbo:** force BUILD_REASON=publish for tasks that involve publint ([7e50524](https://github.com/AlexAegis/js-tooling/commit/7e505246bafb7dcbcb925c8a86593d85440d7187))
* **vite:** preserve comments in pure js libraries ([ed7a61c](https://github.com/AlexAegis/js-tooling/commit/ed7a61c411c3823f5d669cabd5f605c8e16f59d0))

## [0.5.9](https://github.com/AlexAegis/js-tooling/compare/v0.5.8...v0.5.9) (2023-07-21)


### Features

* **autotool-plugin-github:** cicd template is now generic ([3f729a2](https://github.com/AlexAegis/js-tooling/commit/3f729a2b9a66802d74b54d0a2778d044325dd3e1))

## [0.5.8](https://github.com/AlexAegis/js-tooling/compare/v0.5.7...v0.5.8) (2023-07-21)


### Features

* **autotool-plugin-vite:** offer a config for jsdoc based libs ([408beb2](https://github.com/AlexAegis/js-tooling/commit/408beb2ebe8d778bd43446f995c4007932fa7580))
* **autotool-plugin-vite:** only run dts when building for publishing ([#9](https://github.com/AlexAegis/js-tooling/issues/9)) ([479bbed](https://github.com/AlexAegis/js-tooling/commit/479bbed720ff71aedd040b3c6e42ae9ef77e26ec))

## [0.5.7](https://github.com/AlexAegis/js-tooling/compare/v0.5.6...v0.5.7) (2023-07-21)


### Features

* **svelte-config:** added a new package for the svelte configs ([147ec95](https://github.com/AlexAegis/js-tooling/commit/147ec954852c928a3e51352fdf208081209116dc))
* **svelte-config:** jsdoc based package ([45abda8](https://github.com/AlexAegis/js-tooling/commit/45abda8c8233b858f1eb58277cd9fbac9d87fb44))

## [0.5.6](https://github.com/AlexAegis/js-tooling/compare/v0.5.5...v0.5.6) (2023-07-19)


### Features

* **autotool-plugin-stylelint:** fixed patterns added all supported html-like extensions ([45038ea](https://github.com/AlexAegis/js-tooling/commit/45038ea67a3cf9ef05236e9439b5514024c96405))

## [0.5.5](https://github.com/AlexAegis/js-tooling/compare/v0.5.4...v0.5.5) (2023-07-19)


### Features

* consolidated prettier config ([b0921c3](https://github.com/AlexAegis/js-tooling/commit/b0921c34fe22735a68ef0a0ef4931c4a560c90c0))

## [0.5.4](https://github.com/AlexAegis/js-tooling/compare/v0.5.3...v0.5.4) (2023-07-19)


### Features

* **eslint-config-svelte:** disabled some conflicting rules ([71b7ffc](https://github.com/AlexAegis/js-tooling/commit/71b7ffc48191cf1d3cb27157363e4d8923656bfc))
* **prettier-config-svelte:** re-added prettier-plugin-svelte ([bf4a172](https://github.com/AlexAegis/js-tooling/commit/bf4a1723113df52a1ba36bad4d0a70dabf3ae058))
* **vitest:** add an include glob ([d5856f0](https://github.com/AlexAegis/js-tooling/commit/d5856f0ab7c97351aa24e75209e03fb69b4b0ad4))

## [0.5.3](https://github.com/AlexAegis/js-tooling/compare/v0.5.2...v0.5.3) (2023-07-18)


### Features

* **autotool-plugin-svelte:** moved svelte specific tsconfigs here ([d9a5d98](https://github.com/AlexAegis/js-tooling/commit/d9a5d989b5be274aa617cf6b51d54e65edc489b3))
* **autotool-plugin-ts:** cache incremental tsc output with turbo ([d109913](https://github.com/AlexAegis/js-tooling/commit/d1099137e02eb274cd299926041bfba5cb109332))

## [0.5.2](https://github.com/AlexAegis/js-tooling/compare/v0.5.1...v0.5.2) (2023-07-18)


### Features

* **autotool-plugin-vite:** do not install vite for svelte libraries ([96a204a](https://github.com/AlexAegis/js-tooling/commit/96a204a2712b9d491a5e3f14a4786ff724b1832a))

## [0.5.1](https://github.com/AlexAegis/js-tooling/compare/v0.5.0...v0.5.1) (2023-07-18)


### Bug Fixes

* moved unified-prettier to dependencies ([b49c3c7](https://github.com/AlexAegis/js-tooling/commit/b49c3c744517dc425f289c91a3f25152a8f59ced))

## [0.5.0](https://github.com/AlexAegis/js-tooling/compare/v0.4.2...v0.5.0) (2023-07-18)


### Features

* **autotool-plugin-depcheck:** add @pakk/cli to the ignore list ([0aaa4a4](https://github.com/AlexAegis/js-tooling/commit/0aaa4a4160e6df863db35dc5f520666f8ad46ffa))
* **autotool-plugin-eslint:** add svelte support ([a6b9cc2](https://github.com/AlexAegis/js-tooling/commit/a6b9cc2834f244428190235b995a84b48300525c))
* **autotool-plugin-svelte:** a more comprehensive svelte setup ([1e3b7cb](https://github.com/AlexAegis/js-tooling/commit/1e3b7cbb5af0a8056f4f8c056e48ccf612a7eccd))
* **autotool-plugin-ts:** add "hidden" json files to include ([eb4a356](https://github.com/AlexAegis/js-tooling/commit/eb4a3567347ba54d84826c4387e571d859f11450))
* **autotool-plugin-ts:** include more in the workspace root ([aefb22e](https://github.com/AlexAegis/js-tooling/commit/aefb22e2e5507256d09629decd3e4bb6b82746a2))
* **autotool-plugin-vscode:** exclude the folders themselves from readonly ([7115fc8](https://github.com/AlexAegis/js-tooling/commit/7115fc849fa78afd8a2398dab19812967d45baf4))
* **eslint-config-core:** use new ts project settings ([7d70733](https://github.com/AlexAegis/js-tooling/commit/7d707332da697d9491f022fe45389bf3a84d0897))
* migrated to unified-prettier from remark-prettier ([c6decbb](https://github.com/AlexAegis/js-tooling/commit/c6decbbeb28436ef35bc456c8979e9472e1ed0c2))
* **nuke:** nuke now also clears the .svelte-kit dir ([4b70511](https://github.com/AlexAegis/js-tooling/commit/4b70511129c0f524416bffea50b64b05feace495))


### Bug Fixes

* build autotool plugins before running autotool on workspace postinstall ([7d6c669](https://github.com/AlexAegis/js-tooling/commit/7d6c669ed68b261428e8b0b192fcaf0c8cc17e86))

## [0.4.2](https://github.com/AlexAegis/js-tooling/compare/v0.4.1...v0.4.2) (2023-07-08)


### Features

* **autotool-plugin-workspace:** distribute sorting preference of package.json ([e7f6aee](https://github.com/AlexAegis/js-tooling/commit/e7f6aeee1a7773d72bb4edea7d1bd7be435ffaca))

## [0.4.1](https://github.com/AlexAegis/js-tooling/compare/v0.4.0...v0.4.1) (2023-07-06)


### Features

* **autotool-plugin-vscode:** added readonly and linkedediting options ([bef793f](https://github.com/AlexAegis/js-tooling/commit/bef793f5f690b12fe70b0a4635ec2865280c57a1))

## [0.3.4](https://github.com/AlexAegis/js-tooling/compare/v0.3.3...v0.3.4) (2023-07-01)


### Features

* **autotool-plugin-turbo:** reworked turbo configuration ([eb710ec](https://github.com/AlexAegis/js-tooling/commit/eb710eccd95adb40813e1c942749beba1146d3a5))


### Bug Fixes

* use predicades where negated results are used ([9659f0c](https://github.com/AlexAegis/js-tooling/commit/9659f0c20505ce691fe954da6b98aa71cd6c26bc))

## [0.3.3](https://github.com/AlexAegis/js-tooling/compare/v0.3.2...v0.3.3) (2023-06-27)


### Features

* **autotool-plugin-workspace:** add fixtures as a package kind ([9544086](https://github.com/AlexAegis/js-tooling/commit/9544086588856a96690b3e59da4bdf160f965aad))
* library config is now easier to modify if needed ([9f767d2](https://github.com/AlexAegis/js-tooling/commit/9f767d22ed2bfae860b49cfa3b410230a361044b))
* migrating from autolib to pakk ([7d42931](https://github.com/AlexAegis/js-tooling/commit/7d429318d587f5943cfc77eb22fe498619a6f863))


### Bug Fixes

* **autotool-plugin-prettier:** add types and easier overridability ([5b3ed29](https://github.com/AlexAegis/js-tooling/commit/5b3ed296b4f236bd57347a90d47dfd3c4e14b867))
* **autotool-plugin-turbo:** run prebuild in the same package too ([6347617](https://github.com/AlexAegis/js-tooling/commit/634761723ebc50581abb598029d9fba89417b795))
* **standard-version:** do not bump bins ([a3b9400](https://github.com/AlexAegis/js-tooling/commit/a3b94003d76d12d76148fac3f9c8c343fd03677b))
* **vite:** default entry should be an array ([d62af74](https://github.com/AlexAegis/js-tooling/commit/d62af744b4739ec644aa26718a6b3273a3d4dcfe))

## [0.3.2](https://github.com/AlexAegis/js-tooling/compare/v0.3.1...v0.3.2) (2023-06-18)


### Features

* better vite lib config, updated dependencies ([5a683a1](https://github.com/AlexAegis/js-tooling/commit/5a683a193faf3ad4ac89ba713707e6d18cfd314d))
* updated autolib to autofill fields for provenance ([c6142da](https://github.com/AlexAegis/js-tooling/commit/c6142da628285936cd1be3e7925e0cffa50c65b4))


### Bug Fixes

* prettierignore and eslintrc ([f551a1d](https://github.com/AlexAegis/js-tooling/commit/f551a1d3be320bea60da2480b9645d353e8b456d))

## [0.3.1](https://github.com/AlexAegis/js-tooling/compare/v0.3.0...v0.3.1) (2023-05-29)


### Features

* **autotool-plugin-github:** add package provenance ([1328ee8](https://github.com/AlexAegis/js-tooling/commit/1328ee8696f97f33e3948c07335de21e74a6abb5))
* **autotool-plugin-turbo:** added publint to ce ([73a4443](https://github.com/AlexAegis/js-tooling/commit/73a4443d8a6274476cadb26b0e649004e942ea38))
* **autotool-plugin-turbo:** renamed ce to all ([b91ef54](https://github.com/AlexAegis/js-tooling/commit/b91ef54ae3845df2f04447c1d177492aeb42e8ac))
* **autotool-plugin-workspace:** engine preferences ([e9932b3](https://github.com/AlexAegis/js-tooling/commit/e9932b3e9545a0fc6c0092b8163401004bf1040e))
* **autotool-plugin-workspace:** read packageManager from this package ([e8b8713](https://github.com/AlexAegis/js-tooling/commit/e8b8713416affd7c96f0660b0ee33e9e111b674b))
* **prettier-config-svelte:** svelte specific prettierconfig ([c065ec6](https://github.com/AlexAegis/js-tooling/commit/c065ec6800922f009d46a87364d5fa66ceaada31))
* **prettier-config-tailwind:** extracted tailwind config ([7e2ff54](https://github.com/AlexAegis/js-tooling/commit/7e2ff549e1cc96b6c23e5e393c73b12f5a155f7f))

## [0.3.0](https://github.com/AlexAegis/js-tooling/compare/v0.2.0...v0.3.0) (2023-05-19)


### Features

* add TARGET_ENV as build dep, fix publint setup ([063a03f](https://github.com/AlexAegis/js-tooling/commit/063a03f42b0191e96ab3c050bcd89b211c1a411b))
* **autotool-plugin-commitlint:** migrated to autotool ([62c5400](https://github.com/AlexAegis/js-tooling/commit/62c540055c5b54384838cc5d2ea3f692922994b1))
* **autotool-plugin-depcheck:** migrated to autotool ([140b406](https://github.com/AlexAegis/js-tooling/commit/140b40694bd15c502256434e04a9edbc718dcb8e))
* **autotool-plugin-editorconfig:** migrated to autotool ([1867a3b](https://github.com/AlexAegis/js-tooling/commit/1867a3ba1021c26b68bdc9908b63ef92bd28f4a0))
* **autotool-plugin-eslint:** migrated to autotool ([ff87e6f](https://github.com/AlexAegis/js-tooling/commit/ff87e6fcb8a967de2d93be5cfe9b57dcb9f13c90))
* **autotool-plugin-github:** migrated to autotool ([f93273d](https://github.com/AlexAegis/js-tooling/commit/f93273d5c1e281d96aba91a7575ea3e6b480090e))
* **autotool-plugin-git:** migrated to autotool ([75af425](https://github.com/AlexAegis/js-tooling/commit/75af425b272ebd5be0167dd4f6c3d0025dace728))
* **autotool-plugin-husky:** migrated to autotool ([02a220b](https://github.com/AlexAegis/js-tooling/commit/02a220b26211500d32e3d39c9a7de46eedfc5ea7))
* **autotool-plugin-prettier:** migrated prettier setup ([c7a3d48](https://github.com/AlexAegis/js-tooling/commit/c7a3d481f2b6e841bb62d77b0c4804950b68e8d1))
* **autotool-plugin-publint:** migrated to autotool ([ba25293](https://github.com/AlexAegis/js-tooling/commit/ba252937dfcabdb2f59b7e3b5e43cf16a6a4043f))
* **autotool-plugin-remark:** migrated to autotool ([5a01a29](https://github.com/AlexAegis/js-tooling/commit/5a01a29f8a66f1fa16428d1aefcbb828f1e32fbc))
* **autotool-plugin-standard-version:** migrated to autotool ([787193f](https://github.com/AlexAegis/js-tooling/commit/787193f7b66d9169be68a867620c5749330d3b11))
* **autotool-plugin-stylelint:** migrated to autotool ([41178d4](https://github.com/AlexAegis/js-tooling/commit/41178d44ff2913aa53ff750d5b5bb207b245ed00))
* **autotool-plugin-svelte:** migrated to autotool ([51d426f](https://github.com/AlexAegis/js-tooling/commit/51d426fb68447ce2b78ea6246e31e90c35c6ec7f))
* **autotool-plugin-ts:** applied plugin ([0ec022f](https://github.com/AlexAegis/js-tooling/commit/0ec022feca81cb95b55c6a76c6b1cc0f65afcc11))
* **autotool-plugin-ts:** migrated ([141c138](https://github.com/AlexAegis/js-tooling/commit/141c1386af6ad911ae81720fea221968d0dbcbd8))
* **autotool-plugin-turbo:** migrated to autotool ([a548ea7](https://github.com/AlexAegis/js-tooling/commit/a548ea7813d5279fc9da59af762da6da67e20a83))
* **autotool-plugin-typedoc:** migrated to autotool ([1d18258](https://github.com/AlexAegis/js-tooling/commit/1d1825852b14b2c9e44fcfcf114a7c2894a4d7a7))
* **autotool-plugin-vite:** migrated to autotool ([2a1674c](https://github.com/AlexAegis/js-tooling/commit/2a1674cf2511806153669647ab4d592f5f8f365d))
* **autotool-plugin-vitest:** migrated to autotool ([b99c89b](https://github.com/AlexAegis/js-tooling/commit/b99c89b596aeb6b4dd9db354ed05d6bc03e973d2))
* **autotool-plugin-vscode:** migrated to autotool ([06c7612](https://github.com/AlexAegis/js-tooling/commit/06c76124e3d34c2f044931d0730f174a2226db2b))
* **autotool-plugin-workspace:** migrated to autotool ([6710dee](https://github.com/AlexAegis/js-tooling/commit/6710dee589182c5ee1866b7ebff285b5418bf475))
* converted setup-ts to the new plugin format ([465622a](https://github.com/AlexAegis/js-tooling/commit/465622a56694cf0de069dc450a5597d616110bd4))
* create default plugin ([81681a3](https://github.com/AlexAegis/js-tooling/commit/81681a39eb3b1df858549728eab29343af28b9db))
* depcheck should ignore autotool plugins ([7c22094](https://github.com/AlexAegis/js-tooling/commit/7c220948969aa934cbf54c695de25445ea8582f6))
* **eslint-config-core:** better svelte support ([7508621](https://github.com/AlexAegis/js-tooling/commit/7508621d1aae8913d685300e8589dbd1a7155802))
* **object-match:** add JsonMatcherFrom ([2650ffc](https://github.com/AlexAegis/js-tooling/commit/2650ffc54ee602233d1cb736df64dd39790a3f8b))
* **object-match:** implement object matching package ([1d144ab](https://github.com/AlexAegis/js-tooling/commit/1d144ab27a068a97b4fc63e316864fe408da44b5))
* reduce concurrency to 16 ([2d544e2](https://github.com/AlexAegis/js-tooling/commit/2d544e2963825e0ec211691ab367b0157aabbc3f))
* **setup-github:** got rid of NPM_PACKAGE_ORG_PREFIX from cicd env ([d7a30e6](https://github.com/AlexAegis/js-tooling/commit/d7a30e6096f81bdb1dec819855d7969942cbc87f))
* **setup-publint:** add setup-publint ([7c2498e](https://github.com/AlexAegis/js-tooling/commit/7c2498ebf868de0e7cf28835ea6c0c0f532d5085))
* **setup-stylelint:** added html setup for html like files like svelte ([82d3199](https://github.com/AlexAegis/js-tooling/commit/82d31998a0da6a905821a9ce2cec3e4a274fdd98))
* **setup-svelte:** add package ([82afbc6](https://github.com/AlexAegis/js-tooling/commit/82afbc618a2d58acf28d04bd7ee806e336fd21f5))
* **setup-svelte:** basic setup ([5562b85](https://github.com/AlexAegis/js-tooling/commit/5562b85d3af603537d68a94bfc54d0d34738c15d))
* **setup-svelte:** move inspector out of experimental ([83c4761](https://github.com/AlexAegis/js-tooling/commit/83c4761b78c3e37aaee7361b7b9013d7025cb586))
* **setup:** added sourcePlugin info for errors ([d1840b6](https://github.com/AlexAegis/js-tooling/commit/d1840b6c0d50ab43c9e5d320f37d0e3ff2a35949))
* **setup:** pluginify executors ([a39e84f](https://github.com/AlexAegis/js-tooling/commit/a39e84f665cea245b872ff8e6cc04f77ecf46061))
* simpler prettier command ([d00ca76](https://github.com/AlexAegis/js-tooling/commit/d00ca765001da30dc937a61152c01ca012fca365))


### Bug Fixes

* ignore .svelte-kit folder ([70b7f0b](https://github.com/AlexAegis/js-tooling/commit/70b7f0bf101a85491ae8dc21afa2eeff7ae7dc52))
* **object-match:** add boolean support ([c0b112b](https://github.com/AlexAegis/js-tooling/commit/c0b112bea14ffdb467070db63e185eec079a79b9))
* removed tsc from typedoc dependencies, as it would result in double work ([73b0966](https://github.com/AlexAegis/js-tooling/commit/73b0966b0f8413fab01a0bbb914c514d4ddeb067))
* **setup-git:** bad export ([d9e16d0](https://github.com/AlexAegis/js-tooling/commit/d9e16d07a094759ce6a0bd269204ee66f56a4a96))
* **setup-publint:** fix and apply ([e19aaa3](https://github.com/AlexAegis/js-tooling/commit/e19aaa35ac88168c087fc23fbc7a5b19e9783a60))
* **setup-typedoc:** fix filename ([0303371](https://github.com/AlexAegis/js-tooling/commit/030337134fe6b732d08298b39f3a3dea7ff89df0))

## [0.2.0](https://github.com/AlexAegis/js-tooling/compare/v0.1.9...v0.2.0) (2023-04-22)


### Features

* **setup-github:** combine lint jobs into a single matrix ([232e663](https://github.com/AlexAegis/js-tooling/commit/232e663b4f77774a903863678b0409f090bf14f4))
* **stylelint-config:** add standard-scss ([ba2e956](https://github.com/AlexAegis/js-tooling/commit/ba2e9561d8a2d5824ed810d1eb1c4c68273a6e50))

## [0.1.10](https://github.com/AlexAegis/js-tooling/compare/v0.1.9...v0.1.10) (2023-04-22)


### Features

* **stylelint-config:** add standard-scss ([ba2e956](https://github.com/AlexAegis/js-tooling/commit/ba2e9561d8a2d5824ed810d1eb1c4c68273a6e50))

## [0.1.9](https://github.com/AlexAegis/js-tooling/compare/v0.1.8...v0.1.9) (2023-04-22)

## [0.1.8](https://github.com/AlexAegis/js-tooling/compare/v0.1.7...v0.1.8) (2023-04-15)


### Features

* added solutions as an excluded dir in root tsconfig ([2a85efc](https://github.com/AlexAegis/js-tooling/commit/2a85efc3624e8b610350d0ebff658013eedd4f24))
* **eslint-config-core:** allow for loops ([f9d77cf](https://github.com/AlexAegis/js-tooling/commit/f9d77cfbdc94e277c90057527f7651477660d23d))
* **setup-remark:** add remark as a devDep too for LSP ([a2f7dc9](https://github.com/AlexAegis/js-tooling/commit/a2f7dc9b45534d3fff0cc42997da46710577bea4))
* **ts:** use nodenext module for node configs ([b343a5b](https://github.com/AlexAegis/js-tooling/commit/b343a5bbf27b656df319d16919aa697fce750446))


### Bug Fixes

* **setup-ts:** fix double caret ([7f868ca](https://github.com/AlexAegis/js-tooling/commit/7f868ca7037fe2833ebfa6eb946d0c8082e33c65))
* **setup-vitest:** added marks ([11a7a4a](https://github.com/AlexAegis/js-tooling/commit/11a7a4aede1dbbde0402c8bbacfaecbfe2f02df6))

## [0.1.7](https://github.com/AlexAegis/js-tooling/compare/v0.1.6...v0.1.7) (2023-04-12)


### Features

* **setup-vitest:** add svelte vitest configuration ([0ba6067](https://github.com/AlexAegis/js-tooling/commit/0ba60671272a48c90f2ea1db33656907f9177c97))
* **ts:** use bundler moduleResolution for web projects ([010cccb](https://github.com/AlexAegis/js-tooling/commit/010cccb26188d52aad63aa2f54174ca603d99406))
* **vitest:** add svelte vitest configuration ([38756d7](https://github.com/AlexAegis/js-tooling/commit/38756d7bca0ba38a42776bac8c0e3dbbc0e4c55e))


### Bug Fixes

* use sveltePreprocess directly ([285d696](https://github.com/AlexAegis/js-tooling/commit/285d69699846292124d0c103173fbe4f700c81f4))

## [0.1.6](https://github.com/AlexAegis/js-tooling/compare/v0.1.5...v0.1.6) (2023-04-12)


### Features

* **eslint-config-core:** allow void as this arg ([b7d06ee](https://github.com/AlexAegis/js-tooling/commit/b7d06eec52de0d5ff8784c38b7c54093bc1384e2))
* **setup-ts:** add node types for node setups ([12d92f9](https://github.com/AlexAegis/js-tooling/commit/12d92f96442cd28cdedc3831d3ffa7257206302d))


### Bug Fixes

* **setup-vite:** add missing vite dep ([06c2d27](https://github.com/AlexAegis/js-tooling/commit/06c2d273e90fd500bb2ca2323216cba9b12cf45e))

## [0.1.5](https://github.com/AlexAegis/js-tooling/compare/v0.1.4...v0.1.5) (2023-04-11)


### Bug Fixes

* **setup-vitest:** watch mode ([eb1e9ea](https://github.com/AlexAegis/js-tooling/commit/eb1e9ea458a4aa421e212d613b5fef20a560ae49))

## [0.1.4](https://github.com/AlexAegis/js-tooling/compare/v0.1.3...v0.1.4) (2023-04-11)

## [0.1.3](https://github.com/AlexAegis/js-tooling/compare/v0.1.2...v0.1.3) (2023-04-09)


### Features

* **setup-typedoc:** set up monorepo strategy ([bb9f1a1](https://github.com/AlexAegis/js-tooling/commit/bb9f1a191312e0acf36c13553c4e18a83104cffa))

## [0.1.2](https://github.com/AlexAegis/js-tooling/compare/v0.1.1...v0.1.2) (2023-04-09)


### Features

* added setup-depcheck ([4f1c981](https://github.com/AlexAegis/js-tooling/commit/4f1c981d7ffc558d30f687e634834fe5ee1668cf))
* build-lib typedoc require chain ([854613f](https://github.com/AlexAegis/js-tooling/commit/854613f823fd1a9ca2a00ddd0d14abfa9eb740c5))
* ignore typedoc output ([0ddf5b3](https://github.com/AlexAegis/js-tooling/commit/0ddf5b36f18c8dce52b539f078ea71b69682b39c))
* **setup-workspace:** add pnpm workspace file ([06c3b41](https://github.com/AlexAegis/js-tooling/commit/06c3b414d4cc403f9b44af496af3c4c3c8dcc302))
* stylelint, turbo caching ([da1e597](https://github.com/AlexAegis/js-tooling/commit/da1e5975b6b7719a17ed790a64350b612b6aca11))


### Bug Fixes

* **setup-husky:** added marks to hooks ([da158a8](https://github.com/AlexAegis/js-tooling/commit/da158a8de09ba0755df77124f094eb8a5e0ad23d))

## [0.1.1](https://github.com/AlexAegis/js-tooling/compare/v0.1.0...v0.1.1) (2023-04-08)


### Features

* add a version range to setup-workspace deps ([9f081fc](https://github.com/AlexAegis/js-tooling/commit/9f081fc1e0f54847d6fd0450071a98e90eec4edf))
* add setup-depcheck to setup-all ([bba9d73](https://github.com/AlexAegis/js-tooling/commit/bba9d73e8d90f1c3812a482155d86ff6080d4862))
* update vscode extensions and settings ([a02a6b9](https://github.com/AlexAegis/js-tooling/commit/a02a6b9719aa56082f5366e6099b496851c85186))


### Bug Fixes

* **setup-depcheck:** add missing workspace level script ([d54d9a7](https://github.com/AlexAegis/js-tooling/commit/d54d9a7b7b10f38024c724787bece13b39c2eb15))
* **setup-turbo:** add depcheck to the lint group ([9caa1c3](https://github.com/AlexAegis/js-tooling/commit/9caa1c346fb8d0ef27b80793d5d191c415873c13))

## [0.1.0](https://github.com/AlexAegis/js-tooling/compare/v0.0.5...v0.1.0) (2023-04-08)


### Features

* add setup-typedoc and eslint-config-vitest ([558c9b6](https://github.com/AlexAegis/js-tooling/commit/558c9b660d641140796b157e62dde7d02175b940))
* added dynamic test requirement chaining ([6b59e81](https://github.com/AlexAegis/js-tooling/commit/6b59e81bb96fa9b8a5f0c03c43a3f73e48526641))
* added setup-depcheck ([e7aec7b](https://github.com/AlexAegis/js-tooling/commit/e7aec7bf82c6c873f471fa146856681ddbcd699b))
* extend eslint config with the vitest preset ([45e9089](https://github.com/AlexAegis/js-tooling/commit/45e9089e9e8cf99371a00e24b19f9684c0812746))
* respect protocol and version range while updating versions ([6ea629f](https://github.com/AlexAegis/js-tooling/commit/6ea629f4970f4cf25e47592b9f5ad95f642ff557))
* switch to standard-version style hooks ([032513a](https://github.com/AlexAegis/js-tooling/commit/032513a8f85d90b34fbb1ded10cf1207263070bc))

## [0.0.5](https://github.com/AlexAegis/js-tooling/compare/v0.0.4...v0.0.5) (2023-04-04)


### Bug Fixes

* add a precommit install for version bumps ([4576979](https://github.com/AlexAegis/js-tooling/commit/4576979950dc366eeb58848a123e017e1ef5e2b7))
* moved precommit hook to a git hook ([4749337](https://github.com/AlexAegis/js-tooling/commit/474933749a7b2d7ba409e8f7060091a804b1a82d))

## [0.0.4](https://github.com/AlexAegis/js-tooling/compare/v0.0.3...v0.0.4) (2023-04-04)


### Features

* add all setup packages to workspace package ([62f0a66](https://github.com/AlexAegis/js-tooling/commit/62f0a66099311496e647d4837d813eea2b0d6df3))
* added mocks folder to the tsconfig scope ([052bd1b](https://github.com/AlexAegis/js-tooling/commit/052bd1bb4c9793ada80b53771d34b7021f02edb7))


### Bug Fixes

* added the ts package as a devDep of root packageJsons ([4415781](https://github.com/AlexAegis/js-tooling/commit/441578142c43af7f10fca9d099019d0e16da4b32))

## [0.0.3](https://github.com/AlexAegis/js-tooling/compare/v0.0.2...v0.0.3) (2023-04-03)

## [0.0.2](https://github.com/AlexAegis/js-tooling/compare/v0.0.1...v0.0.2) (2023-03-12)


### Bug Fixes

* bin extensions ([610cd9e](https://github.com/AlexAegis/js-tooling/commit/610cd9e5c7cefd239067c85f71117d2df44fa72f))

## 0.0.1 (2023-03-07)


### Features

* a tiny rework ([07d5e83](https://github.com/AlexAegis/js-tooling/commit/07d5e832111273e947077a012d607e784a81438b))
* added an example svelte application ([13a83d5](https://github.com/AlexAegis/js-tooling/commit/13a83d5c5a2ee3807766c446f9793baf52472b06))
* apps can hot reload when a library changes ([240fce6](https://github.com/AlexAegis/js-tooling/commit/240fce6d273c873bb663900c5b54f73fb5cd146c))
* autobin autolinks ([566bf60](https://github.com/AlexAegis/js-tooling/commit/566bf60ddae757156afd832c4dd7e224310bf3d3))
* autobin working again with hooks support ([fec889c](https://github.com/AlexAegis/js-tooling/commit/fec889c0c4628a824b702818b146bf87cc6e456e))
* autopackage autobin ([d491080](https://github.com/AlexAegis/js-tooling/commit/d49108001457acc7e3908287feeb1928d345c409))
* better logging ([417e2bb](https://github.com/AlexAegis/js-tooling/commit/417e2bb97bd9b25c65d788a1dc8dc06deaf1c6a2))
* bin and hook handling ([4980b35](https://github.com/AlexAegis/js-tooling/commit/4980b3594312182f812a985c8f854a25017c5034))
* complex tsconfig setup ([eb66466](https://github.com/AlexAegis/js-tooling/commit/eb664663fb4f3ecc14b764889cd13fafab03517a))
* distribute now uses copy, symlink stays as an option ([a9e63c1](https://github.com/AlexAegis/js-tooling/commit/a9e63c1afa9179a8b7eea6584870b3a8d89d0278))
* distributed new eslint setup ([61e2e20](https://github.com/AlexAegis/js-tooling/commit/61e2e2056f727b0e6420762c96883db9604c867a))
* eslint and ts setup ([046f3b0](https://github.com/AlexAegis/js-tooling/commit/046f3b0352cbfe93bcd5ba7f3cb653650e51203f))
* experimenting with turbo chains ([684e490](https://github.com/AlexAegis/js-tooling/commit/684e490b543242c74ca2449d58494e56881e6d80))
* extend lint-staged js/ts step with cjs/mjs variants ([9717cd3](https://github.com/AlexAegis/js-tooling/commit/9717cd3a776019c143e44a2d5bfcadf850da820c))
* force mjs extension for npx compatibilty ([44358bf](https://github.com/AlexAegis/js-tooling/commit/44358bf7bd05d580946b4e6cbb1d04583b3a490e))
* index tests ([ebacdb0](https://github.com/AlexAegis/js-tooling/commit/ebacdb0febb99bb0c57f8f5ba09cc544bb0a3e54))
* initial release ([c49affc](https://github.com/AlexAegis/js-tooling/commit/c49affc1a8369cb2cbe2731c0caac89fd95bb4e4))
* **lint-staged-config:** add tsc check ([c805b75](https://github.com/AlexAegis/js-tooling/commit/c805b75bd32fdc3b19a8c9f4614db99da4a75710))
* make everything buildable ([af33227](https://github.com/AlexAegis/js-tooling/commit/af33227b244a1ce0d1ab125f1e5281e8966f94c5))
* moved vite-plugin-autolib to a new repo ([4d7e636](https://github.com/AlexAegis/js-tooling/commit/4d7e63609999959883145a11b3c1f11e08164e3c))
* nuke cli ([9537cc8](https://github.com/AlexAegis/js-tooling/commit/9537cc856aa05dbb12bba305da2022d857c55a1f))
* nuke with globby ([a1bb724](https://github.com/AlexAegis/js-tooling/commit/a1bb7243341b4addbfd6c84474b2e1cdd2f5fb61))
* **nuke:** migrated logger ([a822c0c](https://github.com/AlexAegis/js-tooling/commit/a822c0c44fb55fbba0bbd9f5854ea2fb6ebe669b))
* parallel ([9f68c78](https://github.com/AlexAegis/js-tooling/commit/9f68c7820d4e7d322d52913115b9524319d9481e))
* prettier package ([f3e8d3d](https://github.com/AlexAegis/js-tooling/commit/f3e8d3d0f54c330b3f2ffece283b792561e68231))
* removed the local tools package in favor of workspace-tools ([d94619d](https://github.com/AlexAegis/js-tooling/commit/d94619d21e5994343150cf5010663d712999d75a))
* self setup tsconfig and eslint ([10c5325](https://github.com/AlexAegis/js-tooling/commit/10c5325a01bad8ff56f1b52bf76bc6165d59316f))
* settle on the simplified tsconfig setup ([dd90f2c](https://github.com/AlexAegis/js-tooling/commit/dd90f2ce26ff676adb35963244e0c1ad1910fac1))
* setup bin added for setup-remark ([def0f60](https://github.com/AlexAegis/js-tooling/commit/def0f601a405656cb9441842cee89f37d8b6910e))
* setup commitlint, vscode, github ([56a1f57](https://github.com/AlexAegis/js-tooling/commit/56a1f57c983e2f44e581c66bf69ec4f5c59f0532))
* setup standard-version ([1753d82](https://github.com/AlexAegis/js-tooling/commit/1753d824ec4899621eeac1d6f3d1124067e87ef0))
* setup stylelint ([90e94bf](https://github.com/AlexAegis/js-tooling/commit/90e94bf7b4621e925bad8f5c90e84c15b71812ef))
* setup turbo ([293c0c4](https://github.com/AlexAegis/js-tooling/commit/293c0c4cde98b721d28d879d6dd2948db9105cee))
* setup vitest ([4517038](https://github.com/AlexAegis/js-tooling/commit/4517038c631d8a07fd9fc6b27456594fa4697fc5))
* **setup-husky:** added lint-staged ([557280a](https://github.com/AlexAegis/js-tooling/commit/557280a7bfd743259cbe0d4967c20b302fa33eee))
* **setup-vite:** update config ([f0c4161](https://github.com/AlexAegis/js-tooling/commit/f0c416195b79475542bad7c190cb960c68e26c90))
* standard-version config ([ab75df3](https://github.com/AlexAegis/js-tooling/commit/ab75df39e27caca47b322df90228b5d3f77c8637))
* tsconfig package ([d1aa3da](https://github.com/AlexAegis/js-tooling/commit/d1aa3daa7709fdc8903ea88024d88c17c039c9cb))
* update eslint and tsconfig and remark ([5458c7f](https://github.com/AlexAegis/js-tooling/commit/5458c7f1ef460d66371cb5542ad8b8b30bc2b254))
* use final standard version config ([d82049c](https://github.com/AlexAegis/js-tooling/commit/d82049c357fc6ebe4ad0ca88a1483a4509a3b300))
* use local dependencies as local dependencies ([8b14315](https://github.com/AlexAegis/js-tooling/commit/8b1431587b90bf52ab89d5653a6ccb055616a990))
* use peerDeps for deps with bins ([56ec633](https://github.com/AlexAegis/js-tooling/commit/56ec6332db1255f6b5cc8200cfe836e05c723307))
* vite app nodemon+concurrently script ([4c81f2c](https://github.com/AlexAegis/js-tooling/commit/4c81f2c795a7824f8eac558a29d601e2188963a4))
* vite plugin for packageJson augmentation ([f2fa9ea](https://github.com/AlexAegis/js-tooling/commit/f2fa9eaba88f7aa44a049295ef2a75cc0c08cdb0))
* working autopackage plugin ([15d7142](https://github.com/AlexAegis/js-tooling/commit/15d714276afad10c8a3001663e7659922478cb3c))


### Bug Fixes

* chain building remark config before checks ([b3954f8](https://github.com/AlexAegis/js-tooling/commit/b3954f88250cf0da6d6b443178146390e6793956))
* distribute ([a69fe10](https://github.com/AlexAegis/js-tooling/commit/a69fe1081346b242fc96c5cc742e6f9208044230))
* dont delete whats about to be distributed ([98dbd49](https://github.com/AlexAegis/js-tooling/commit/98dbd49e9573f3e22a6abb2b72b08f589e9cf0d8))
* eslint and ts setup now works ([4e65579](https://github.com/AlexAegis/js-tooling/commit/4e65579cd46e1fa5d9138a29ab2567aae7417c04))
* faux ci command ([2d491b7](https://github.com/AlexAegis/js-tooling/commit/2d491b707758e1f6fe95ac2e2f76259c93d71968))
* fully qualified names for "moduleResolution": "nodenext" ([320c03e](https://github.com/AlexAegis/js-tooling/commit/320c03e70cdd1f42ff1926fba6d52efa360ded73))
* ignore more with eslint ([11f031c](https://github.com/AlexAegis/js-tooling/commit/11f031c514e9ddce088186143846a964baa39a92))
* rename deploy app ([47d9921](https://github.com/AlexAegis/js-tooling/commit/47d99212f9c6829b085819edbca971746933ef23))
* **setup-editorconfig:** package name fixed ([9a3afbb](https://github.com/AlexAegis/js-tooling/commit/9a3afbb39b23fea681c07a5a9a4cb8b12a875116))
* **setup-remark:** now everything silently ignores ([9eebee4](https://github.com/AlexAegis/js-tooling/commit/9eebee425daa1fe04066f257a0bb99504b782a8a))
* tsc setup ([e927d33](https://github.com/AlexAegis/js-tooling/commit/e927d3384ff5a2733ff009ebc924e05940a44295))
* turbo dep on new build script ([48596af](https://github.com/AlexAegis/js-tooling/commit/48596afb847208ec0bd9c3aaafd2c23ebc8676a2))
