import { collectWorkspacePackageDirectories } from './collect-workspace-package-directories.function.js';

import { existsSync } from 'node:fs';

import { stat, symlink } from 'node:fs/promises';
import { basename, join } from 'node:path';

export const linkToWorkspace = async (file: string, cwd: string = process.cwd()): Promise<void> => {
	const fileName = basename(file);

	if (!existsSync(join(cwd, file))) {
		console.error(`couldn't link '${file}', it doesn't exist`);
		return;
	}

	const fileStats = await stat(file);
	if (!fileStats.isFile()) {
		console.error(`couldn't link '${file}', it's not a file`);
		return;
	}

	const packageDirectories = await collectWorkspacePackageDirectories(cwd);

	for (const packageDirectory of packageDirectories) {
		const target = join(packageDirectory, fileName);
		const targetStats = await stat(target);

		if (!existsSync(target)) {
			symlink(file, target, 'junction');
		} else if (targetStats.isFile() && !targetStats.isSymbolicLink()) {
			console.log('target', target, targetStats.isFile(), targetStats.isSymbolicLink());
			console.info(`didn't link ${file} to ${target}, already exists`);
		}
	}
};
