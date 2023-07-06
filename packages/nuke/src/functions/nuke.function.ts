import { dry } from '@alexaegis/common';
import { collectWorkspacePackages } from '@alexaegis/workspace-tools';
import { globby } from 'globby';
import { existsSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { normalizeNukeOptions, type NukeOptions } from './nuke.function.options.js';

/**
 * Removes a bunch of stuff from packages for cleaning.
 * @param path
 * @param options
 */
export const nuke = async (rawOptions?: NukeOptions): Promise<void> => {
	const options = normalizeNukeOptions(rawOptions);

	const allWorkspacePackages = await collectWorkspacePackages(options);

	if (allWorkspacePackages.length === 0) {
		throw new Error('not in a workspace!');
	}

	const nukeList = [...options.nukeList, ...options.nukeMore];
	const nukeGlobs = [...options.nukeGlobs, ...options.nukeMoreGlobs];

	const nonSkippedWorkspacePackages = allWorkspacePackages.filter(
		(workspacePackage) =>
			!options.dontNukeIn.some((skip) =>
				typeof skip === 'string'
					? skip === workspacePackage.packagePath
					: skip.test(workspacePackage.packagePath),
			),
	);

	const rootPackage = allWorkspacePackages.find(
		(workspacePackage) => workspacePackage.packageKind === 'root',
	);

	if (!rootPackage) {
		options.logger.error('Not inside a workspace!');
		return;
	}

	const packageFlatNukeTargets = nonSkippedWorkspacePackages.flatMap((workspacePackage) =>
		nukeList.map((toNuke) => join(workspacePackage.packagePath, toNuke)),
	);

	const packageGlobNukeTargets = await Promise.all(
		nonSkippedWorkspacePackages.map((packageDirectory) =>
			globby(nukeGlobs, {
				cwd: packageDirectory.packagePath,
				dot: true,
				followSymbolicLinks: false,
				expandDirectories: false,
			}).then((paths) => paths.map((path) => join(packageDirectory.packagePath, path))),
		),
	);

	const everyNukeTarget = [...packageFlatNukeTargets, ...packageGlobNukeTargets.flat()].sort();
	const dryRm = dry(options.dry, rm);

	await Promise.allSettled(
		everyNukeTarget
			.filter((nukeTarget) => existsSync(nukeTarget))
			.map((nukeTarget) => {
				options.logger.warn(
					'obliterating: ' + relative(rootPackage.packagePath, nukeTarget),
				);
				return dryRm(nukeTarget, { recursive: true }).catch(() => false);
			}),
	);
};
