import { posix } from 'node:path';
import type { UserConfig } from 'vite';
import { getBundledFileExtension } from './append-bundle-file-extension.function.js';

import { AutoBinOptions, normalizeAutoBinOptions } from './auto-bin.class.options.js';
import { cloneJsonSerializable } from './clone-json-serializable.function.js';
import { offsetPathRecordValues } from './collect-export-entries.function.js';
import { collectFileMap } from './collect-export-map.function.js';
import { deepMerge } from './deep-merge.function.js';
import { makeJavascriptFilesExecutable } from './make-javascript-files-executable.function.js';
import { normalizePackageName } from './normalize-package-name.function.js';
import type { PackageJson } from './package-json.type.js';
import type { PreparedBuildUpdate } from './prepared-build-update.type.js';
import { stripFileExtension } from './strip-file-extension.function.js';

/**
 * From https://docs.npmjs.com/cli/v8/using-npm/scripts
 * And anything that start pre- and post- that also matches a user defined
 * script (prebuild and postbuild works if 'build' exists)
 */
export const ALL_NPM_HOOKS = [
	'prepare',
	'preinstall',
	'install',
	'postinstall',
	'prepublish',
	'preprepare',
	'prepare',
	'postprepare',
	'prepack',
	'postpack',
	'prepublishOnly',
	'publish',
	'postpublish',
	'prerestart',
	'restart',
	'postrestart',
];

export class AutoBin implements PreparedBuildUpdate {
	private options: Required<AutoBinOptions>;

	private binPathsFromSrc: Record<string, string> = {};
	private binPathsFromPackageRoot: Record<string, string> = {};

	constructor(options: AutoBinOptions) {
		this.options = normalizeAutoBinOptions(options);
	}

	getViteConfigUpdates(): UserConfig {
		return { build: { lib: { entry: this.binPathsFromPackageRoot } } };
	}

	async preUpdate(packageJson: PackageJson) {
		const clonePackageJson = cloneJsonSerializable(packageJson);
		this.binPathsFromSrc = await collectFileMap(
			this.options.sourceDirectory,
			this.options.binGlobs
		);
		this.binPathsFromPackageRoot = offsetPathRecordValues(
			this.binPathsFromSrc,
			this.options.sourceDirectory
		);

		clonePackageJson.bin = undefined;

		return clonePackageJson;
	}

	async update(packageJson: PackageJson) {
		const hasCjs = this.options.formats.includes('cjs');
		const hasEs = this.options.formats.includes('es');
		const hasUmd = this.options.formats.includes('umd');

		const umdExtension = getBundledFileExtension('umd', packageJson.type);
		const esmExtension = getBundledFileExtension('es', packageJson.type);
		const cjsExtension = getBundledFileExtension('cjs', packageJson.type);

		const normalizedPackageName = normalizePackageName(packageJson.name);

		const enabledHooks = this.options.enabledHooks ?? ALL_NPM_HOOKS;

		const packageJsonUpdates = Object.entries(this.binPathsFromSrc).reduce(
			(result, [key, value]) => {
				const fileName = stripFileExtension(value);
				let binName = key;
				let binFile: string;
				if (hasEs) {
					binFile = `${fileName}.${esmExtension}`;
				} else if (hasCjs) {
					binFile = `${fileName}.${cjsExtension}`;
				} else if (hasUmd) {
					binFile = `${fileName}.${umdExtension}`;
				} else {
					binFile = `${fileName}.js`;
				}
				if (enabledHooks.includes(fileName)) {
					binName = `${normalizedPackageName ? normalizedPackageName + '-' : ''}${key}`;
					result.scripts[fileName] = posix.join(binFile);
				}

				result.bin[binName] = binFile;
				return result;
			},
			{ bin: {} as Record<string, string>, scripts: {} as Record<string, string> }
		);

		await makeJavascriptFilesExecutable(
			Object.values(this.binPathsFromSrc),
			this.options.outDir
		);

		return deepMerge(packageJson, packageJsonUpdates);
	}

	adjustPaths(packageJson: PackageJson, _offset: string) {
		// TODO: retarget
		return packageJson;
	}
}
