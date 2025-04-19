import { asyncFilterMap } from '@alexaegis/common';
import { writeJson } from '@alexaegis/fs';
import { DEFAULT_EXPORT_FORMATS, Pakk, normalizePakkOptions, type PakkOptions } from '@pakk/core';
import p from 'node:path';
import type { Plugin, PluginOption, UserConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { preserveImportAttributes } from './preserve-import-attributes.js';
import { createLazyAutoExternalsFunction } from './rollup-externals.function.js';

/**
 * # Pakk
 *
 * Autofills your vite config, packageJson and distribution packageJson
 * based on conventional file and directory layouts.
 *
 * Packaging a publishable library is as easy as defining a vite config with
 * just this single plugin (also wraps [vite-plugin-dts](https://github.com/qmhc/vite-plugin-dts)):
 *
 * ```ts
 * import { defineConfig } from 'vite';
 * import { pakk } from 'vite-plugin-pakk';
 *
 * export default defineConfig({
 * 	plugins: [
 * 		pakk(),
 * 	],
 * });
 * ```
 *
 */
export const pakk = (rawOptions?: PakkOptions): PluginOption => {
	let pakk: Pakk;
	const options = normalizePakkOptions(rawOptions);
	const pakkPlugin: Plugin = {
		name: 'pakk',
		apply: 'build',
		config: async (config) => {
			const startTime = performance.now();

			const formats =
				config.build?.lib && config.build.lib.formats
					? config.build.lib.formats
					: DEFAULT_EXPORT_FORMATS;

			const outDir: string = config.build?.outDir ?? options.outDir;

			pakk = await Pakk.withContext(
				{
					formats,
					fileName:
						config.build?.lib && typeof config.build.lib.fileName === 'function'
							? config.build.lib.fileName
							: undefined,
				},
				{
					...options,
					outDir,
				},
			);

			options.logger.info(
				'examining workspace package at',
				pakk.context.workspacePackage.packageJsonPath,
			);

			options.logger.trace('initial vite config', config);

			if (config.build?.lib && !!config.build.lib.entry) {
				options.logger.info('build.lib.entry is defined in vite config, will be ignored!');
				// If the original vite config had it's entries defined as an array it would result in an error https://github.com/vitejs/vite/issues/13641
				config.build.lib.entry = {};
			}

			if (config.build?.outDir && rawOptions?.outDir) {
				options.logger.info(
					`vite plugin defines build.outDir as "${config.build.outDir}". ` +
						`Using that over "${rawOptions.outDir}"`,
				);
			}

			const examinationResult = await pakk.examinePackage();

			options.logger.trace('examination result', examinationResult);
			options.logger.trace('outDir', outDir);

			const viteConfigUpdates: Partial<UserConfig> = {
				build: {
					target: config.build?.target ?? 'es2022',
					minify: config.build?.minify ?? false,
					sourcemap: config.build?.sourcemap ?? false,
					outDir,
					rollupOptions: {
						external:
							config.build?.rollupOptions?.external ??
							createLazyAutoExternalsFunction(),
						treeshake: config.build?.rollupOptions?.treeshake ?? true,
					},
					lib: {
						formats: pakk.context.formats,
						entry: examinationResult.bundlerEntryFiles, // The entry has to be an array to keep the file's names in the output directory too.
					},
				},
			};

			options.logger.info(
				`preparation phase took ${Math.floor(performance.now() - startTime).toString()}ms to finish`,
			);

			return viteConfigUpdates;
		},
		closeBundle: async () => {
			options.logger.info(
				'processing workspace package at',
				pakk.context.workspacePackage.packageJsonPath,
			);
			// I have to cheat a little bit by starting the timer here because other plugins can
			// steal the thread during an async copy step
			const startTime = performance.now();

			await asyncFilterMap(pakk.getTargetPackageJsonKinds(), async (packageJsonTarget) => {
				const { updatedPackageJson, path } =
					await pakk.createUpdatedPackageJson(packageJsonTarget);

				options.logger.info('writing updated package.json to', path);

				await writeJson(updatedPackageJson, path, {
					autoPrettier: pakk.options.autoPrettier,
					dry: pakk.options.dry,
				});
			});

			options.logger.info(
				`update phase took ~${Math.floor(performance.now() - startTime).toString()}ms to finish`,
			);
		},
	} as Plugin;

	const plugins = [pakkPlugin];

	if (options.dts) {
		plugins.push(
			dts({
				copyDtsFiles: true,
				cleanVueFileName: true,
				entryRoot: p.join(options.srcDir, options.exportBaseDir),
			}),
		);
	}

	if (options.preserveImportAttributes) {
		plugins.push(preserveImportAttributes(options.preserveImportAttributes));
	}

	return plugins;
};
