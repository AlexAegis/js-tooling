import { DryOption, normalizeDryOption } from '@alexaegis/common';
import { LoggerOptions, NormalizedLoggerOptions, normalizeLoggerOptions } from '@alexaegis/logging';
import {
	CollectWorkspacePackagesOptions,
	normalizeCollectWorkspacePackagesOptions,
} from '@alexaegis/workspace-tools';

export const DEFAULT_NUKE_LIST: string[] = [
	'node_modules',
	'dist',
	'.turbo',
	'coverage',
	'package-lock.json',
	'pnpm-lock.yaml',
];

export const DEFAULT_NUKE_GLOBS: string[] = ['./vite.config.ts.timestamp*'];

export interface NukeOptions
	extends DryOption,
		CollectWorkspacePackagesOptions,
		Omit<LoggerOptions, 'domain'> {
	/**
	 * Don't remove `node_modules` directories but try to clean them up
	 *
	 * @default false
	 */
	skipNodeModules?: boolean;

	/**
	 * A list of relative paths this script will remove in every package
	 * in the workspace. If you define this, the default are not applied.
	 *
	 * If you only wish to extend or remove parts of it use the `nukeMore`
	 * and `dontNuke` fields and leave this one alone.
	 *
	 * @default DEFAULT_NUKE_LIST
	 */
	nukeList?: string[];

	/**
	 * Globs to also remove.
	 *
	 * If you only wish to extend or remove parts of it use the `nukeMoreGlobs`
	 * and `dontNuke` fields and leave this one alone.
	 *
	 * @default DEFAULT_NUKE_GLOBS
	 */
	nukeGlobs?: string[];

	/**
	 * Additional globs to nuke if you don't want to overwrite the default ones
	 *
	 * @default undefined
	 */
	nukeMoreGlobs?: string[];

	/**
	 * These will be nuked too. Same role as `nukeList` but defining this
	 * won't get rid of the built in nukelist
	 *
	 * @default []
	 */
	nukeMore?: string[];

	/**
	 * If it shouldn't nuke a specific package, add them here.
	 *
	 * @default []
	 */
	dontNukeIn?: (string | RegExp)[];
}

export type NormalizedNukeOptions = Required<NukeOptions> & NormalizedLoggerOptions;

export const normalizeNukeOptions = (options?: NukeOptions): NormalizedNukeOptions => {
	return {
		...normalizeCollectWorkspacePackagesOptions(options),
		...normalizeDryOption(options),
		...normalizeLoggerOptions({ ...options, domain: '☢ nuke' }),
		skipNodeModules: options?.skipNodeModules ?? false,
		nukeList: options?.nukeList ?? DEFAULT_NUKE_LIST,
		nukeGlobs: options?.nukeGlobs ?? DEFAULT_NUKE_GLOBS,
		nukeMoreGlobs: options?.nukeMoreGlobs ?? [],
		nukeMore: options?.nukeMore ?? [],
		dontNukeIn: options?.dontNukeIn ?? [],
	};
};
