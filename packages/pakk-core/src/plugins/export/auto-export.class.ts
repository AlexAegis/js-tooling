import type { PackageJson, PackageJsonExportConditions } from '@alexaegis/workspace-tools';
import p from 'node:path';
import type { PackageExaminationResult, PakkFeature } from '../pakk-feature.type.js';
import { stripFileExtension } from './helpers/strip-file-extension.function.js';

import { toAbsolute } from '@alexaegis/fs';
import { globby } from 'globby';
import { dirname } from 'node:path/posix';
import type { LibraryFormats } from 'vite';
import type { NormalizedPakkContext } from '../../internal/pakk.class.options.js';
import {
	PACKAGE_JSON_KIND,
	PackageJsonExportTarget,
	type PathMap,
} from '../../package-json/index.js';
import {
	DEFAULT_PACKAGE_JSON_EXPORT_PATH,
	normalizeAutoExportOptions,
	type AutoExportOptions,
	type NormalizedAutoExportOptions,
} from './auto-export.class.options.js';
import type { EntryPathVariantMap } from './export-map.type.js';
import { createExportMapFromPaths } from './helpers/create-export-map-from-paths.function.js';
import type { PackageExportPathContext } from './package-export-path-context.interface.js';

export const allExportPathCombinations = [
	`${PACKAGE_JSON_KIND.DEVELOPMENT}-to-${PackageJsonExportTarget.SOURCE}`,
	`${PACKAGE_JSON_KIND.DEVELOPMENT}-to-${PackageJsonExportTarget.DIST}`,
	`${PACKAGE_JSON_KIND.DISTRIBUTION}-to-${PackageJsonExportTarget.DIST}`,
] as const;
export type AllExportPathCombinations = (typeof allExportPathCombinations)[number];
export type ExportPathMap = PathMap<AllExportPathCombinations>;

export type ExportTargetFileFormats = LibraryFormats;

/**
 * Generates exports entries automatically
 */
export class AutoExport implements PakkFeature {
	public readonly order = 1;

	private readonly options: NormalizedAutoExportOptions;
	private readonly context: NormalizedPakkContext;

	private exportMap: EntryPathVariantMap<AllExportPathCombinations> = {};

	constructor(context: NormalizedPakkContext, options?: AutoExportOptions) {
		this.context = context;
		this.options = normalizeAutoExportOptions(options);
	}

	async examinePackage(_packageJson: PackageJson): Promise<Partial<PackageExaminationResult>> {
		const absoluteExportBaseDir = toAbsolute(
			p.posix.join(this.context.srcDir, this.options.exportBaseDir),
			{
				cwd: this.context.workspacePackage.packagePath,
			},
		);

		const ignore = [...this.options.exportsIgnore, ...this.options.defaultExportsIgnore];
		this.context.logger.trace('ignoring exports', ignore);

		const entryFiles = await globby(this.options.exports, {
			cwd: absoluteExportBaseDir,
			ignore,
			onlyFiles: true,
			dot: true,
		});
		this.context.logger.info('detected package exports', entryFiles);

		this.exportMap = createExportMapFromPaths(entryFiles, {
			outDir: this.context.outDir,
			srcDir: this.context.srcDir,
			basePath: this.options.exportBaseDir,
			keyKind: 'extensionless-relative-path-from-base',
		});

		this.context.logger.trace('exportMap', this.exportMap);

		return {
			bundlerEntryFiles: entryFiles.reduce<Record<string, string>>((acc, entryFile) => {
				const path = p.posix.join(
					this.context.srcDir,
					this.options.exportBaseDir,
					entryFile,
				);
				const alias = stripFileExtension(entryFile);
				acc[alias] = path;
				return acc;
			}, {}),
		};
	}

	/**
	 * This plugin compiles the exports object for a packageJson file
	 *
	 * For the distributed packageJson it should always contain paths that are
	 * targeting the dist folder from the dist folder.
	 *
	 * For development packageJson the types always target the source for
	 * immediate feedback by the LSP by local consumers of the package.
	 * The actual code that's being imported by node has two options,
	 * by default they target the outDir and expect libraries to be built
	 * before actually running them in a local setting.
	 * There's an alternative mode however that will target the source files.
	 */
	process(_packageJson: PackageJson, pathContext: PackageExportPathContext): PackageJson {
		const entryExports: Record<string, PackageJsonExportConditions | string> = {};

		if (this.options.exportPackageJson) {
			this.context.logger.debug('adding the package.json export entry');
			entryExports[DEFAULT_PACKAGE_JSON_EXPORT_PATH] = DEFAULT_PACKAGE_JSON_EXPORT_PATH;
		}

		for (const [key, pathVariants] of Object.entries(this.exportMap)) {
			let path: string;
			let typesPath: string = pathVariants['development-to-source'];

			const isSvelteFile = pathVariants['distribution-to-dist'].endsWith('.svelte');
			// Forcing dev package to consume only source files.
			const developmentPackageJsonExportsTarget = this.options.svelte
				? PackageJsonExportTarget.SOURCE
				: this.options.developmentPackageJsonExportsTarget;

			if (pathContext.packageJsonKind === PACKAGE_JSON_KIND.DISTRIBUTION) {
				path = pathVariants['distribution-to-dist'];

				if (isSvelteFile) {
					typesPath = pathVariants['distribution-to-dist'] + '.d.ts'; // foo.svelte => foo.svelte.d.ts
				} else if (pathVariants['distribution-to-dist'].endsWith('.ts')) {
					typesPath = stripFileExtension(pathVariants['distribution-to-dist']) + '.d.ts'; // foo.ts => foo.d.ts
				} else {
					typesPath = pathVariants['distribution-to-dist'];
				}
			} else if (developmentPackageJsonExportsTarget === PackageJsonExportTarget.SOURCE) {
				// svelte files are not recognized by typescript when imported across node_modules,
				// so even local packages are pointing to the compiled d.ts files
				// this makes it a complete inversion of regular ts files where instead of
				// types point to the source for instant feedback and source files to the compiled
				// ones to not compile the same source multiple times
				// for svelte, you point types to the compiled d.ts because you don't have an option
				// and you point the implementation to the source because there's no difference,
				// the source will be distributed anyway as svelte files
				// But this only applies for direct exports. If you instead export a ts file as
				// your package api, and export a svelte module from that, types will work just fine
				// so it's better to do that instead.
				if (isSvelteFile) {
					typesPath = pathVariants['development-to-dist'] + '.d.ts'; // foo.svelte => foo.svelte.d.ts
				}
				path = pathVariants['development-to-source'];
			} else {
				path = pathVariants['development-to-dist'];
			}

			const fileName = p.basename(path);
			const dir = dirname(path);
			const extensionlessFileName = stripFileExtension(fileName);

			const exportConditions: PackageJsonExportConditions = {
				types: typesPath,
			};

			if (this.context.formats.includes('cjs')) {
				exportConditions.require =
					'./' + p.posix.join(dir, this.context.fileName('cjs', extensionlessFileName));
			} else {
				if (this.context.formats.includes('umd')) {
					exportConditions.require =
						'./' +
						p.posix.join(dir, this.context.fileName('umd', extensionlessFileName));
				} else if (this.context.formats.includes('iife')) {
					exportConditions.require =
						'./' +
						p.posix.join(dir, this.context.fileName('iife', extensionlessFileName));
				}
			}

			if (this.context.formats.includes('es')) {
				exportConditions.import =
					'./' + p.posix.join(dir, this.context.fileName('es', extensionlessFileName));
			}

			if (this.context.formats.includes(this.context.primaryFormat)) {
				exportConditions.default =
					'./' +
					p.posix.join(
						dir,
						isSvelteFile
							? fileName
							: this.context.fileName(
									this.context.primaryFormat,
									extensionlessFileName,
								),
					);
			}

			if (this.options.svelte) {
				exportConditions['svelte'] =
					'./' +
					p.posix.join(
						dir, // Let svelte import the source file regardless
						isSvelteFile
							? fileName
							: this.context.fileName('es', extensionlessFileName),
					);

				if (isSvelteFile) {
					delete exportConditions.import;
					delete exportConditions.require;
				}
			}

			const indexNormalizedKey = key.replace(/\/index$/, '/').replace(/^.\/$/, '.');

			entryExports[indexNormalizedKey] = exportConditions;
		}

		// This arrangement will first clean the exports entry then re-populate it
		return [{ exports: undefined }, { exports: entryExports }];
	}
}
