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
		return;
	}

	if (onlyWorkspaceRoot) {
		targetPackages.splice(1);
	}

	if (skipWorkspaceRoot) {
		targetPackages.shift();
	}

	const emptyTargets = targetPackages
		.map((targetPackage) => join(targetPackage, fileName))
		.filter((targetFilePath) => !existsSync(targetFilePath));

	await Promise.all(
		emptyTargets.map((targetFilepath) => {
			const relativeFromTargetBackToFile = relative(dirname(targetFilepath), filePath);
			return symlink(relativeFromTargetBackToFile, targetFilepath)
				.then(() => {
					console.info(`symlinked ${targetFilepath} to ${relativeFromTargetBackToFile}`);
				})
				.catch((error) => {
					console.warn(`can't link ${file}, error happened`, error);
				});
		})
	);
};
