import type { Defined, Replace } from '@alexaegis/common';
import {
	normalizeCwdOption,
	normalizeWriteJsonOptions,
	type CwdOption,
	type WriteJsonOptions,
} from '@alexaegis/fs';
import {
	createLogger,
	normalizeLogLevelOption,
	type LogLevelOption,
	type LoggerOption,
} from '@alexaegis/logging';
import type { PackageJson } from '@alexaegis/workspace-tools';
import type { LibraryFormats, LibraryOptions } from 'vite';
import {
	normalizeAutoBinOptions,
	type AutoBinOptions,
} from '../plugins/bin/auto-bin.class.options.js';

import {
	normalizeAutoExportOptions,
	normalizeAutoExportStaticOptions,
	normalizeAutoSortPackageJsonOptions,
	type AutoExportOptions,
	type AutoExportStaticOptions,
	type NormalizedAutoSortPackageJsonOptions,
	type PackageJsonKindType,
	type PakkFeatureName,
} from '../index.js';
import {
	normalizeAutoMetadataOptions,
	type AutoMetadataOptions,
} from '../plugins/metadata/auto-metadata.class.options.js';
import { DEFAULT_OUT_DIR, DEFAULT_SRC_DIR } from './defaults.const.js';
import type { CurrentWorkspacePackageWithRoot } from './find-current-and-root-workspace-package.function.js';

/**
 * A function that can be defined on Vite where it expects you to decide the
 * name of a file based on the output format.
 *
 * the fileName parameter here is an extensionless filename.
 *
 * For example if an entry point is at 'src/api/hello.ts' the name it will
 * pass is just 'hello'
 */
export type ViteFileNameFn = Exclude<LibraryOptions['fileName'], string | undefined>;

export interface PakkContext extends CurrentWorkspacePackageWithRoot, CwdOption, LoggerOption {
	formats: LibraryFormats[];
	fileName?: ViteFileNameFn | undefined;
	/**
	 * Will depend on the "type" field in the packageJson file.
	 * 'es' if 'module', 'cjs' otherwise.
	 */
	primaryFormat: LibraryFormats;

	packageType: NonNullable<PackageJson['type']>;

	/**
	 * source root, relative to cwd
	 * @defaultValue 'src'
	 */
	srcDir?: string | undefined;

	/**
	 * the expected output directory relative to the package's directory.
	 *
	 * @defaultValue 'dist'
	 */
	outDir?: string | undefined;
}

export type NormalizedPakkContext = Defined<PakkContext>;

export interface PakkOptions
	extends WriteJsonOptions,
		CwdOption,
		LoggerOption,
		LogLevelOption,
		AutoBinOptions,
		AutoExportOptions,
		AutoExportStaticOptions,
		AutoMetadataOptions {
	/**
	 * Source root, relative to the package directory
	 *
	 * @defaultValue 'src'
	 */
	srcDir?: string | undefined;

	/**
	 * The expected output directory relative to the package's directory.
	 *
	 * @defaultValue 'dist'
	 */
	outDir?: string | undefined;

	/**
	 * packageJson to modify and put in the artifact, relative to the package's
	 * directory.
	 *
	 * @defaultValue 'package.json'
	 */
	sourcePackageJson?: string | undefined;

	/**
	 * Which packageJson to act on. Will do both when left empty.
	 * - 'development': the one in your packages folder that you yourself edit too
	 * - 'distribution': the one that is coped to the 'dist' folder
	 *
	 * By default is undefined, meaning both.
	 *
	 * @defaultValue undefined
	 */
	targetPackageJsonKind?: PackageJsonKindType | undefined;

	/**
	 * If left empty, all features will remain enabled. Except the disabled ones
	 */
	enabledFeatures?: PakkFeatureName[] | undefined;

	/**
	 * If left empty, all features will remain enabled. Takes precedence over
	 * 'enabledFeatures'
	 */
	disabledFeatures?: PakkFeatureName[] | undefined;

	/**
	 * Generate dts definitions using https://github.com/qmhc/vite-plugin-dts
	 */
	dts?: boolean | undefined;

	/**
	 * An option to preserve import attributes in output bundles.
	 * It can preserve both 'assert' and 'with' attributes but by default it
	 * only keeps asserts.
	 *
	 * Set to false to turn it off.
	 *
	 * @default 'assert'
	 */
	preserveImportAttributes?: boolean | 'both' | 'assert' | 'with' | undefined;
}

export type NormalizedPakkOptions = Defined<
	Replace<Omit<PakkOptions, 'targetPackageJsonKind'>, { filterFeatures: RegExp[] }>
> &
	Pick<PakkOptions, 'targetPackageJsonKind'> &
	NormalizedAutoSortPackageJsonOptions;

export const normalizePakkOptions = (options?: PakkOptions): NormalizedPakkOptions => {
	const logLevelOptions = normalizeLogLevelOption(options);
	return {
		...normalizeCwdOption(options),
		...logLevelOptions,
		...normalizeWriteJsonOptions(options),
		...normalizeAutoBinOptions(options),
		...normalizeAutoExportOptions(options),
		...normalizeAutoExportStaticOptions(options),
		...normalizeAutoMetadataOptions(options),
		...normalizeAutoSortPackageJsonOptions(options),
		logger:
			options?.logger ?? createLogger({ name: 'pakk', minLevel: logLevelOptions.logLevel }),
		sourcePackageJson: options?.sourcePackageJson ?? 'package.json',
		srcDir: options?.srcDir ?? DEFAULT_SRC_DIR,
		outDir: options?.outDir ?? DEFAULT_OUT_DIR,
		enabledFeatures: options?.enabledFeatures ?? [],
		disabledFeatures: options?.disabledFeatures ?? [],
		autoPrettier: options?.autoPrettier ?? true,
		dts: options?.dts ?? true,
		preserveImportAttributes: options?.preserveImportAttributes ?? 'assert',
		targetPackageJsonKind: options?.targetPackageJsonKind,
	};
};
