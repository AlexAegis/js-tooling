import { basename } from 'node:path';
import type { UserConfig } from 'vite';
import type { PackageJsonTarget } from '../plugins/autolib.plugin.options.js';
import { getBundledFileExtension } from './append-bundle-file-extension.function.js';

import { AutoBinOptions, normalizeAutoBinOptions } from './auto-bin.class.options.js';
import { offsetPathRecordValues } from './collect-export-entries.function.js';
import { collectFileMap } from './collect-export-map.function.js';
import { enterPathPosix } from './enter-path.function.js';
import { makeJavascriptFilesExecutable } from './make-javascript-files-executable.function.js';
import { normalizePackageName } from './normalize-package-name.function.js';
import type { PackageJson } from './package-json.type.js';
import type { PreparedBuildUpdate } from './prepared-build-update.type.js';
import { retargetPackageJsonPath } from './retarget-package-json-path.function.js';
import { stripFileExtension } from './strip-file-extension.function.js';

export const NPM_INSTALL_HOOKS = [
	'preinstall',
	'install',
	'postinstall',
	'prepublish',
	'preprepare',
	'prepare',
	'postprepare',
];

/**
 * From https://docs.npmjs.com/cli/v8/using-npm/scripts
 * And anything that start pre- and post- that also matches a user defined
 * script (prebuild and postbuild works if 'build' exists)
 */
export const ALL_NPM_HOOKS = [
	...NPM_INSTALL_HOOKS,
	'prepare',
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
	private entryMap: Record<string, string> = {};
	private tsBinMap: Record<string, string> = {};
	private tsSingleBinPath = 'index.ts';
	private markComment = ' # autogenerated';
	private tsNode = 'node --loader ts-node/esm ';

	private outputFiles: string[] = [];

	constructor(options: AutoBinOptions) {
		this.options = normalizeAutoBinOptions(options);
	}

	getViteConfigUpdates(): UserConfig {
		return { build: { lib: { entry: this.entryMap } } };
	}

	async preUpdate(packageJson: PackageJson) {
		packageJson.bin = undefined;
		for (const script in packageJson.scripts) {
			if (packageJson.scripts[script].endsWith(this.markComment)) {
				packageJson.scripts[script] = undefined;
			}
		}

		this.binPathsFromSrc = await collectFileMap(
			this.options.sourceDirectory,
			this.options.binGlobs,
			false,
			true
		);

		this.entryMap = offsetPathRecordValues(this.binPathsFromSrc, this.options.sourceDirectory);
	}

	async update(packageJson: PackageJson) {
		const hasCjs = this.options.formats.includes('cjs');
		const hasEs = this.options.formats.includes('es');
		const hasUmd = this.options.formats.includes('umd');

		const umdExtension = getBundledFileExtension('umd', packageJson.type);
		const esmExtension = getBundledFileExtension('es', packageJson.type);
		const cjsExtension = getBundledFileExtension('cjs', packageJson.type);

		const packageName = normalizePackageName(packageJson.name);

		const enabledHooks = this.options.enabledHooks ?? ALL_NPM_HOOKS;

		const packageJsonUpdates = Object.entries(this.entryMap).reduce(
			(result, [key, value]) => {
				const fileName = stripFileExtension(value);
				const binName = key;
				let binFile = `${fileName}.js`;

				if (hasUmd) {
					binFile = `${fileName}.${umdExtension}`;
					this.outputFiles.push(binFile);
				}

				if (hasCjs) {
					binFile = `${fileName}.${cjsExtension}`;
					this.outputFiles.push(binFile);
				}

				if (hasEs) {
					binFile = `${fileName}.${esmExtension}`;
					this.outputFiles.push(binFile);
				}

				let filestub = basename(binName);
				if (enabledHooks.includes(filestub)) {
					// Only if doesn't exist or marked
					if (
						!packageJson.scripts[filestub] ||
						packageJson.scripts[filestub].endsWith(this.markComment)
					) {
						result.scripts[filestub] = binFile + this.markComment; // before update
					}
					result.tsBinMap[filestub] = value;
					filestub = (packageName ? packageName + '-' : '') + filestub;
				}
				result.tsBinMap[filestub] = value;
				result.bin[filestub] = binFile;

				return result;
			},
			{
				bin: {} as Record<string, string>,
				scripts: {} as Record<string, string>,
				tsBinMap: {} as Record<string, string>,
			}
		);

		this.tsBinMap = packageJsonUpdates.tsBinMap;

		return {
			bin: packageJsonUpdates.bin,
			scripts: packageJsonUpdates.scripts,
		};
	}

	async adjustPaths(
		packageJson: PackageJson,
		packageJsonTarget: PackageJsonTarget
	): Promise<PackageJson> {
		const scriptsUpdate = {};
		let binUpdate = {};
		// TODO: add targeting options source-to-build-keep-bin-to-source

		await makeJavascriptFilesExecutable(
			this.outputFiles.map((path) => enterPathPosix(path, 1)),
			this.options.outDir
		);

		for (const scriptName in packageJson.scripts) {
			// install hooks are forced to target 'source' as otherwise they would break
			// 'npm install'
			const scriptTarget = NPM_INSTALL_HOOKS.includes(scriptName)
				? 'source'
				: packageJsonTarget;
			let script: string = packageJson.scripts[scriptName];
			if (script.endsWith(this.markComment)) {
				let prefix = '';

				if (scriptTarget === 'source') {
					script = this.tsBinMap[scriptName];
					prefix = this.tsNode;
				}
				script = script.replace(this.markComment, '');
				packageJson.scripts[scriptName] =
					prefix + retargetPackageJsonPath(script, scriptTarget) + this.markComment;
			}
		}

		if (typeof packageJson.bin === 'object') {
			const offsetBins = Object.entries(packageJson.bin).reduce(
				(accumulator, [key, binPath]) => {
					if (packageJsonTarget === 'source') {
						binPath = this.tsBinMap[key];
					}
					accumulator[key] = retargetPackageJsonPath(binPath, packageJsonTarget);
					return accumulator;
				},
				{} as Record<string, string>
			);
			binUpdate = offsetBins;
		} else if (packageJson.bin) {
			let binPath = packageJson.bin;

			if (packageJsonTarget === 'source') {
				binPath = this.tsSingleBinPath;
			}
			binUpdate = retargetPackageJsonPath(binPath, packageJsonTarget);
		}

		return { bin: binUpdate, scripts: scriptsUpdate };
	}
}
