import { existsSync } from 'node:fs';
import { lstat, symlink } from 'node:fs/promises';

import { basename, dirname, isAbsolute, join, relative } from 'node:path';
import { collectWorkspacePageDirectoriesByDependency } from './collect-workspace-package-directories-by-dependency.function.js';

export interface DistributeOptions {
	/**
	 * @default []
	 */
	dependencyCriteria?: string[];

	/**
	 * @default process.cwd()
	 */
	cwd?: string;

	/**
	 * @default false
	 */
	onlyWorkspaceRoot?: boolean;

	/**
	 * @default false
	 */
	skipWorkspaceRoot?: boolean;
}

export const distribute = async (file: string, options?: DistributeOptions): Promise<void> => {
	const cwd = options?.cwd ?? process.cwd();
	const dependencyCriteria = options?.dependencyCriteria ?? [];
	const onlyWorkspaceRoot = options?.onlyWorkspaceRoot ?? false;
	const skipWorkspaceRoot = options?.dependencyCriteria ?? false;

	const filePath = isAbsolute(file) ? file : join(cwd, file);
	const fileName = basename(filePath);
	if (!existsSync(filePath)) {
		console.error(`couldn't link '${file}', it doesn't exist`);
		return;
	}
	const fileStats = await lstat(filePath);

	if (!fileStats.isFile()) {
		console.error(`couldn't link '${file}', it's not a file`);
		return;
	}

	const targetPackages = await collectWorkspacePageDirectoriesByDependency(
		cwd,
		dependencyCriteria
	);

	if (targetPackages.length === 0) {
		console.warn(`can't distribute at ${cwd}, not in a workspace`);
	}

	if (onlyWorkspaceRoot) {
		targetPackages.splice(1);
	}

	if (skipWorkspaceRoot) {
		targetPackages.shift();
	}

	for (const targetPackage of targetPackages) {
		const targetFilepath = join(targetPackage, fileName);
		const linkStats = await lstat(targetFilepath);
		if (linkStats?.isSymbolicLink() === false) {
			console.warn(`can't link ${file}, ${targetFilepath} already exists!`);
		} else if (linkStats === undefined) {
			const relativeFromTargetBackToFile = relative(dirname(targetFilepath), filePath);
			console.info(`symlinking ${targetFilepath} to ${relativeFromTargetBackToFile}`);
			await symlink(relativeFromTargetBackToFile, targetFilepath);
		}
	}
};
