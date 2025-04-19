# deep exports

Showcasing custom `src` and `exportBaseDir` options with deep exports.

Normally [`vite-plugin-dts`](https://github.com/qmhc/vite-plugin-dts) calculates
the root of the entry files (`entryRoot` setting) but that can be different in a
project like this example here. This also showcases why the dts plugin has to be
bundled, as it needs the `entryRoot` to be set to
`join(options.srcDir, options.exportBaseDir)`.
