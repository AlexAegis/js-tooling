import { dry } from '@alexaegis/common';
import { collectWorkspacePackages } from '@alexaegis/workspace-tools';
import { globby } from 'globby';
import { existsSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { normalizeNukeOptions, NukeOptions } from './nuke.function.options.js';

/**
 * Removes a bunch of stuff from packages for cleaning.
 * @param path
 * @param options
 */
export const nuke = async (rawOptions?: NukeOptions): Promise<void> => {
	const options = normalizeNukeOptions(rawOptions);

	const allPackageDirectories = await collectWorkspacePackages(options);

	if (allPackageDirectories.length === 0) {
		throw new Error('not in a workspace!');
	}

	const nukeList = [...options.nukeList, ...options.nukeMore];
	const nukeGlobs = [...options.nukeGlobs, ...options.nukeMoreGlobs];

	const packageDirectories = allPackageDirectories.filter(
		(packageDirectory) =>
			!options.dontNukeIn.some((skip) =>
				typeof skip === 'string'
					? skip === packageDirectory.path
					: skip.test(packageDirectory.path)
			)
	);

	const rootPackageDirectory = allPackageDirectories[0];

	if (!rootPackageDirectory) {
		options.logger.error('Not inside a workspace!');
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
	const dryRm = dry(options.dry, rm);

	await Promise.allSettled(
		everyNukeTarget
			.filter((nukeTarget) => existsSync(nukeTarget))
			.map((nukeTarget) => {
				options.logger.warn(
					'obliterating: ' + relative(rootPackageDirectory.path, nukeTarget)
				);
				return dryRm(nukeTarget, { recursive: true }).catch(() => false);
			})
	);
};
