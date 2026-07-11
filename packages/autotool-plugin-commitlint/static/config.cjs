// This config is intentionally shipped as a flat CommonJS module
// (`module.exports = config`) rather than a bundled dual ESM/CJS entry.
//
// commitlint's resolve-extends resolves the `require` export condition (the
// `.cjs`) but then loads it via dynamic `import()` and unwraps `.default`
// exactly once. A bundled CJS entry emits `exports.default = config` (named
// interop), which `import()` nests one level deeper, so a single unwrap leaves
// the rules stranded at `.default` and commitlint sees an empty config
// ("Please add rules to your `commitlint.config.js`"). A flat CJS module has no
// such wrapper and loads correctly under every commitlint version.

const { createCommitlintConfig } = require('@alexaegis/commitlint-config/internal');

module.exports = createCommitlintConfig();
