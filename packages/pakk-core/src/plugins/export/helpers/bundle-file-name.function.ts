import type { PackageJson } from '@alexaegis/workspace-tools';
import type { ModuleFormat } from 'rollup';
import type { ViteFileNameFn } from '../../../internal/pakk.class.options.js';

export type JsExtensionStubs = 'js' | 'cjs' | 'mjs' | `${string}.js`;
export type JsExtensions = `.${JsExtensionStubs}`;

/**
 * This function is used to replicate the default vite behavior when naming
 * bundles. Pakk doesn't try to figure out filenames by reading the filesystem
 * instead it just tries to reuse the defined fileName fn on vite's config.
 * If not available, this will be the fallback.
 *
 * This function only replicates the file naming behavior when vite's entry
 * files are defined as named entries via an object. The naming is different
 * when entries are defined using an array. That is not implemented as pakk
 * will always force a named entry object.
 *
 * Vite's fileName fn is called without the extension, For example when
 * bundling a file called `index.ts` the fileName fn will get only `index`,
 * when called with `foo.config.js` it will recieve `foo.config`.
 *
 * @returns a function that behaves like how vite does by default
 */
export const createDefaultViteFileNameFn: (packageType: PackageJson['type']) => ViteFileNameFn =
	(packageType) => (format, extensionlessFileName) =>
		extensionlessFileName + getDefaultViteBundleFileExtension(format, packageType);

/**
 * Default vite behavior: if no fileName fn is defined, then a commonjs package
 * when built as cjs, will have files with .js extensions, and when built as esm
 * they will have .mjs extension.
 *
 * If it's an esm package, it's the inverse, esm builds will have `.js`
 * extensions and cjs builds will have `.cjs` extension.
 *
 * This aligns with node's behavior where `.js` files are treated based on what
 * their respective packageJson files declare and files with `.mjs` or `.cjs`
 * are always read as esm or cjs modules respectively.
 */
export const getDefaultViteBundleFileExtension = (
	format: ModuleFormat,
	packageType: PackageJson['type'] = 'commonjs',
): JsExtensions => {
	switch (format) {
		case 'es':
		case 'esm': {
			return packageType === 'module' ? '.js' : '.mjs';
		}
		case 'cjs': {
			return packageType === 'commonjs' ? '.js' : '.cjs';
		}
		default: {
			throw new Error(
				`Cannot determine default fileName for format: ${format} only esm and cjs can be auto determined.`,
			);
		}
	}
};
