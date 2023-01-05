import { collectWorkspacePackageDirectoriesWithPackageJson } from '@alexaegis/tools';
import { globby } from 'globby';
import { red, yellow } from 'kolorist';
import { existsSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { join, relative } from 'node:path';

export interface NukeOptions {
	/**
	 * Don't remove `node_modules` directories but try to clean them up
	 *
	 * @default false
	 */
	skipNodeModules?: boolean;

	/**
	 * Don't actually delete anything, just print out what would be deleted
	 *
	 * @default false
	 */
	dry?: boolean;

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

export const DEFAULT_NUKE_LIST: string[] = [
	'node_modules',
	'dist',
	'.turbo',
	'coverage',
	'package-lock.json',
	'pnpm-lock.yaml',
];

export const DEFAULT_NUKE_GLOBS: string[] = ['./vite.config.ts.timestamp*'];

const nukeLogger = (message: string) => console.log(red('[☢ nuke]'), yellow(message));

/**
 * Removes a bunch of stuff from packages for cleaning.
 * @param path
 * @param options
 */
export const nuke = async (path: string, options?: NukeOptions): Promise<void> => {
	const allPackageDirectories = await collectWorkspacePackageDirectoriesWithPackageJson(path);

	if (allPackageDirectories.length === 0) {
		throw new Error('not in a workspace!');
	}

	const nukeList = [...(options?.nukeList ?? DEFAULT_NUKE_LIST), ...(options?.nukeMore ?? [])];
	const nukeGlobs = [
		...(options?.nukeGlobs ?? DEFAULT_NUKE_GLOBS),
		...(options?.nukeMoreGlobs ?? []),
	];
	const skipPackages = options?.dontNukeIn ?? [];

	const packageDirectories = allPackageDirectories.filter(
		(packageDirectory) =>
			!skipPackages.some((skip) =>
				typeof skip === 'string'
					? skip === packageDirectory.path
					: skip.test(packageDirectory.path)
			)
	);

	const rootPackageDirectory = allPackageDirectories[0];

	if (!rootPackageDirectory) {
		nukeLogger('Not inside a workspace!');
		return;
	}

	const packageFlatNukeTargets = packageDirectories.flatMap((packageDirectory) =>
		nukeList.map((toNuke) => join(packageDirectory.path, toNuke))
	);

	const packageGlobNukeTargets = await Promise.all(
		packageDirectories.map((packageDirectory) =>
			globby(nukeGlobs, {
				cwd: packageDirectory.path,
				dot: true,
				followSymbolicLinks: false,
				expandDirectories: false,
			}).then((paths) => paths.map((path) => join(packageDirectory.path, path)))
		)
	);

	const everyNukeTarget = [...packageFlatNukeTargets, ...packageGlobNukeTargets.flat()].sort();

	await Promise.all(
		everyNukeTarget
			.filter((nukeTarget) => existsSync(nukeTarget))
			.map((nukeTarget) => {
				nukeLogger('obliterating: ' + relative(rootPackageDirectory.path, nukeTarget));
				return options?.dry
					? false
					: rm(nukeTarget, { recursive: true }).catch(() => false);
			})
	);
};
