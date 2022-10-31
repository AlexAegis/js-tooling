import { existsSync, statSync } from 'node:fs';
import { basename, join, relative } from 'node:path';
import { collectWorkspacePageDirectoriesByDependency } from './collect-workspace-package-directories-by-dependency.function.js';

export const distribute = (
	file: string,
	dependencyCriteria: string[],
	cwd: string = process.cwd()
): void => {
	const filePath = join(cwd, file);
	const fileName = basename(filePath);

	if (!existsSync(filePath)) {
		console.error(`couldn't link '${file}', it doesn't exist`);
		return;
	}

	const fileStats = statSync(filePath);
	if (!fileStats.isFile()) {
		console.error(`couldn't link '${file}', it's not a file`);
		return;
	}

	const targetPackages = collectWorkspacePageDirectoriesByDependency(cwd, dependencyCriteria);
	for (const targetPackage of targetPackages) {
		const targetFilepath = join(targetPackage, fileName);
		if (existsSync(targetFilepath)) {
			if (!statSync(targetFilepath).isSymbolicLink()) {
				console.warn(`can't link ${file}, ${targetFilepath} already exists!`);
			}
		} else {
			const relativeFromTargetBackToFile = relative(targetFilepath, filePath);
			console.log('SYMLINK', targetFilepath, relativeFromTargetBackToFile);
			// symlinkSync(targetFilepath, relativeFromTargetBackToFile);
		}
	}
};
