import { join, posix } from 'node:path';
import type { UserConfig } from 'vite';
import type { PackageJsonTarget } from '../plugins/autolib.plugin.options.js';
import { getBundledFileExtension } from './append-bundle-file-extension.function.js';
import { AutoEntryOptions, normalizeAutoEntryOptions } from './auto-entry.class.options.js';
import { cloneJsonSerializable } from './clone-json-serializable.function.js';
import { collectImmediate, offsetPathRecordValues } from './collect-export-entries.function.js';
import { createPathRecordFromPaths } from './create-path-record-from-paths.function.js';
import type { PackageJsonExportConditions } from './package-json-export-conditions.type.js';
import type { PackageJson } from './package-json.type.js';
import type { PreparedBuildUpdate } from './prepared-build-update.type.js';
import { stripFileExtension } from './strip-file-extension.function.js';

export class AutoEntry implements PreparedBuildUpdate {
	private options: Required<AutoEntryOptions>;

	private entryFiles: string[] = [];
	private entryMap: Record<string, string> = {};
	private entryExports: Record<string, PackageJsonExportConditions> = {};

	constructor(options: AutoEntryOptions) {
		this.options = normalizeAutoEntryOptions(options);
	}

	getViteConfigUpdates(): UserConfig {
		return { build: { lib: { entry: this.entryMap } } };
	}

	async preUpdate(packageJson: PackageJson) {
		const clonedPackageJson = cloneJsonSerializable(packageJson);
		const fullEntry = join(this.options.sourceDirectory, this.options.entryDir);
		console.log('fullEntryDir', fullEntry);
		this.entryFiles = await collectImmediate(fullEntry, 'file');

		this.entryMap = createPathRecordFromPaths(this.entryFiles, { keyOnlyFilename: true });

		this.entryMap = offsetPathRecordValues(this.entryMap, fullEntry);

		clonedPackageJson.exports = undefined;
		clonedPackageJson.main = undefined;
		clonedPackageJson.module = undefined;

		return clonedPackageJson;
	}

	async update(packageJson: PackageJson) {
		const hasUmd = this.options.formats.includes('umd');
		const hasEsm = this.options.formats.includes('es');
		const hasCjs = this.options.formats.includes('cjs');

		const umdExtension = getBundledFileExtension('umd', packageJson.type);
		const esmExtension = getBundledFileExtension('es', packageJson.type);
		const cjsExtension = getBundledFileExtension('cjs', packageJson.type);

		console.log('entryMap', JSON.stringify(this.entryMap));
		this.entryExports = Object.entries(this.entryMap).reduce(
			(accumulator, [key, entryFile]) => {
				const extensionlessPath = stripFileExtension(entryFile);
				console.log('extensionlessPath', extensionlessPath);
				// Assume there will be a `.d.ts` generated
				const typesPath = `.${posix.sep}${posix.normalize(`${extensionlessPath}.d.ts`)}`;
				const exportConditions: PackageJsonExportConditions = {
					types: typesPath,
				};

				// Add the source ts file as default, will be removed for dist artifact
				exportConditions.default = `.${posix.sep}${posix.normalize(
					`${extensionlessPath}.ts`
				)}`;

				if (hasUmd) {
					exportConditions.require = `.${posix.sep}${posix.normalize(
						`${extensionlessPath}.${umdExtension}`
					)}`;
				}

				if (hasCjs) {
					exportConditions.require = `.${posix.sep}${posix.normalize(
						`${extensionlessPath}.${cjsExtension}`
					)}`;
				}

				if (hasEsm) {
					exportConditions.import = `.${posix.sep}${posix.normalize(
						`${extensionlessPath}.${esmExtension}`
					)}`;
				}
				if (key === 'index') {
					accumulator['.'] = exportConditions;
				} else {
					accumulator['./' + key] = exportConditions;
				}
				return accumulator;
			},
			{} as Record<string, PackageJsonExportConditions>
		);

		return { exports: this.entryExports };
	}

	adjustPaths(packageJson: PackageJson, sourcePackageJsonTarget: PackageJsonTarget): PackageJson {
		const entryExportsOffset = Object.entries(packageJson.exports ?? {}).reduce(
			(accumulator, [key, exportCondition]) => {
				if (key in this.entryExports && typeof exportCondition === 'object') {
					let offsetPath = '';
					let enterPath = 0;
					switch (sourcePackageJsonTarget) {
						case 'source-to-build': {
							exportCondition.default = undefined;
							offsetPath = 'dist';
							enterPath = 1;
							break;
						}
						case 'build-to-build': {
							exportCondition.default = undefined;
							offsetPath = '';
							enterPath = 1;
							break;
						}
						case 'source-to-source': {
							exportCondition.types = undefined;
							exportCondition.require = undefined;
							exportCondition.import = undefined;
							offsetPath = '';
							enterPath = 0;
							break;
						}
					}

					accumulator[key] = offsetPathRecordValues(
						exportCondition,
						offsetPath,
						enterPath
					);
				} else {
					accumulator[key] = exportCondition;
				}

				return accumulator;
			},
			{} as Record<string, PackageJsonExportConditions | string>
		);

		return { exports: entryExportsOffset };
	}
}
