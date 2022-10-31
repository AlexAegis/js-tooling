import type { InputOption } from 'rollup';
import type { BuildOptions, LibraryFormats, Plugin } from 'vite';

import { dirname, join } from 'node:path/posix';
import { DEFAULT_OUT_DIR } from '../configs/index.js';
import {
	AutoExportStaticOptions,
	autoStaticExport,
	DEFAULT_STATIC_EXPORT_GLOB,
} from '../helpers/auto-export-static.function.js';
import { cloneJsonSerializable } from '../helpers/clone-json-serializable.function.js';
import {
	autoBin,
	AutoBinOptions,
	autoExport,
	AutoExportOptions,
	collectFileNamePathEntries,
	DEFAULT_BIN_DIR,
	DEFAULT_EXPORT_FORMATS,
	DEFAULT_EXPORT_FROM_DIR,
	DEFAULT_SRC_DIR,
	offsetPathRecord,
	PackageJsonExportConditions,
	WriteJsonOptions,
	writeJsonSync,
} from '../helpers/index.js';
import { offsetRelativePathPosix } from '../helpers/offset-relative-path.function.js';
import { readPackageJson } from '../helpers/read-package-json.function.js';

export interface AutoPackagerPluginOptions extends WriteJsonOptions {
	/**
	 * source root
	 * @default 'src'
	 */
	src?: string;

	/**
	 * The directory of the package
	 * @default process.cwd()
	 */
	packageRootPath?: string;

	/**
	 * packageJson to modify and put in the artifact, relative to `packageRootPath`
	 * @default './package.json'
	 */
	sourcePackageJson?: string;

	/**
	 * Whether or not to transform the source package json
	 * Useful in a turbo repo where you want to use the built artifact in
	 * other packages, like publishable libraries.
	 * It's best to let `autoPrettier` enabled if this is enabled as the format
	 * @default true
	 */
	editSourcePackageJson?: boolean;

	/**
	 * Generates exports entries form rollup inputs, from a directory relative
	 * to `srcDir`
	 *
	 * If autoExport is disabled, the plugin expects you to either set
	 * `build.lib.entry` yourself or have a `src/index.ts` file as the entry
	 * point
	 *
	 * @default '.'
	 */
	autoExportDirectory?: string | false;

	/**
	 * Automatically export the content of a directory as is
	 *
	 * @default '["export", *.md]'
	 */
	autoExportStaticGlobs?: string[] | false;
	/**
	 * Generates bin entries from files under `srcDir` + `autoBinDirectory`
	 *
	 * @default 'bin'
	 */
	autoBinDirectory?: string | false;
}

/**
 * Packaged formats are defined in config.build.lib.formats, defaults to es and cjs
 *
 * TODO: This plugin will be moved to a different repo
 * @param options
 * @returns
 */
export const autoPackagePlugin = (options?: AutoPackagerPluginOptions): Plugin => {
	const sourcePackageJson = options?.sourcePackageJson ?? 'package.json';
	const packageRootPath = options?.packageRootPath ?? process.cwd();
	const dry = options?.dry ?? false;
	const autoPrettier = options?.autoPrettier ?? true;
	const editSourcePackageJson = options?.editSourcePackageJson ?? true;
	const autoBinDirectory =
		options?.autoBinDirectory === false
			? undefined
			: options?.autoBinDirectory ?? DEFAULT_BIN_DIR;
	const autoExportDirectory =
		options?.autoExportDirectory === false
			? undefined
			: options?.autoExportDirectory ?? DEFAULT_EXPORT_FROM_DIR;

	const autoExportStaticExportGlobs =
		options?.autoExportStaticGlobs === false
			? undefined
			: options?.autoExportStaticGlobs ?? DEFAULT_STATIC_EXPORT_GLOB;
	// At the end of these definitions as these will only settle once
	// `configResolved` ran
	let formats: LibraryFormats[];
	let outDirectory: string;

	let sourceDirectory: string;

	let libraryInputs: Record<string, string>;
	let autoExportOptions: AutoExportOptions | undefined;
	let autoExportStaticOptions: AutoExportStaticOptions | undefined;

	let autoBinOptions: AutoBinOptions | undefined;

	const pluginName = 'autopackage';

	let error: Error | undefined;
	return {
		name: pluginName,
		apply: 'build',
		config: (config) => {
			formats =
				config.build?.lib && config.build?.lib.formats
					? config.build?.lib.formats
					: DEFAULT_EXPORT_FORMATS;

			if (options?.src) {
				sourceDirectory = options.src;
			} else if (config.build?.lib && typeof config.build?.lib?.entry === 'string') {
				sourceDirectory = dirname(config.build?.lib?.entry);
			} else {
				sourceDirectory = DEFAULT_SRC_DIR;
			}

			outDirectory = config.build?.outDir ?? DEFAULT_OUT_DIR;

			let buildOptions: BuildOptions = {
				...config.build,
				sourcemap: true,
				manifest: true,
				ssr: true,
				lib: {
					entry: join(sourceDirectory, 'index.ts'),
					formats,
					...config.build?.lib,
				},
			};

			let entry: Record<string, unknown> | undefined;

			if (autoBinDirectory) {
				const binDirectory = join(sourceDirectory, autoBinDirectory);
				const rawBinInputs = collectFileNamePathEntries(binDirectory);

				autoBinOptions = {
					binInputs: offsetPathRecord(rawBinInputs, autoBinDirectory) as Record<
						string,
						string
					>,
					binDirectory: autoBinDirectory,
					formats,
					outDir: outDirectory,
				};

				const rawBinEntry = collectFileNamePathEntries(sourceDirectory, autoBinDirectory);
				entry = offsetPathRecord(rawBinEntry, binDirectory);
			}

			if (autoExportDirectory) {
				libraryInputs = collectFileNamePathEntries(sourceDirectory, autoExportDirectory);
				autoExportOptions = {
					formats,
					libraryInputs,
					exportFromDir: autoExportDirectory,
					outDir: outDirectory,
				};

				entry = { ...entry, ...offsetPathRecord(libraryInputs, sourceDirectory) };
			}

			if (autoExportStaticExportGlobs) {
				autoExportStaticOptions = {
					outDir: outDirectory,
					staticExportGlobs: autoExportStaticExportGlobs,
				};
			}

			if (entry) {
				buildOptions = {
					...buildOptions,
					lib: {
						...buildOptions.lib,
						entry: entry as InputOption,
					},
				};
			}

			return { build: buildOptions };
		},
		buildEnd: (buildError) => {
			error = buildError;
		},
		writeBundle: () => {
			if (error) {
				console.warn(`${pluginName} didnt run, error happened during build`);
				return;
			}

			const sourcePackageJsonLocation = join(packageRootPath, sourcePackageJson);
			const packageJson = readPackageJson(sourcePackageJsonLocation);
			if (!packageJson) {
				console.warn(
					`${pluginName} didn't find packageJson at ${sourcePackageJsonLocation}!`
				);
				return;
			}

			let processedExports: Record<string, PackageJsonExportConditions> = {};
			if (autoExportOptions) {
				delete packageJson.exports; // Reset
				delete packageJson.main; // Legacy option
				delete packageJson.module; // Legacy option

				processedExports = autoExport(packageJson, autoExportOptions);
				packageJson.exports = processedExports;
			}

			let unprocessedExports: Record<string, string> = {};

			if (autoExportStaticOptions) {
				unprocessedExports = autoStaticExport(autoExportStaticOptions);
				packageJson.exports = { ...unprocessedExports, ...packageJson.exports };
			}

			if (autoBinOptions) {
				delete packageJson.bin;

				delete packageJson.directories?.bin;

				packageJson.bin = autoBin(packageJson, autoBinOptions);
			}

			writeJsonSync(packageJson, join(packageRootPath, outDirectory, 'package.json'), {
				autoPrettier,
				dry,
			});

			if (editSourcePackageJson) {
				const augmentedForSource = cloneJsonSerializable(packageJson);
				if (augmentedForSource.exports) {
					const offsetProcessedExports = offsetPathRecord(processedExports, outDirectory);
					augmentedForSource.exports = {
						...unprocessedExports,
						...offsetProcessedExports,
					};
				}
				if (augmentedForSource.bin) {
					if (typeof augmentedForSource.bin === 'object') {
						augmentedForSource.bin = offsetPathRecord(
							augmentedForSource.bin,
							outDirectory
						);
					} else if (typeof augmentedForSource.bin === 'string') {
						augmentedForSource.bin = offsetRelativePathPosix(
							outDirectory,
							augmentedForSource.bin
						);
					}
				}
				if (augmentedForSource.main) {
					augmentedForSource.main = offsetRelativePathPosix(
						outDirectory,
						augmentedForSource.main
					);
				}
				if (augmentedForSource.module) {
					augmentedForSource.module = offsetRelativePathPosix(
						outDirectory,
						augmentedForSource.module
					);
				}
				if (augmentedForSource.directories && augmentedForSource.directories.bin) {
					augmentedForSource.directories.bin = offsetRelativePathPosix(
						outDirectory,
						augmentedForSource.directories.bin
					);
				}
				writeJsonSync(augmentedForSource, sourcePackageJsonLocation, {
					autoPrettier,
					dry,
				});
			}
		},
	};
};
