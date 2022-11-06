import { distribute, getWorkspaceRoot } from '@alexaegis/tools';
import { existsFile } from '@alexaegis/vite';
import { basename, join } from 'node:path';

/**
 * Links this packages prettierrc file to the root of the repo, and the ignore
 * file to every package
 */
const distributePrettierConfig = () => {
	const workspaceRoot = getWorkspaceRoot();
	const packageName = '@alexaegis/prettier';

	if (!workspaceRoot) {
		console.warn("can't distribute prettier config, not in a workspace!");
		return;
	}

	const packageDirectory = join(workspaceRoot, 'node_modules', packageName);

	const prettierIgnorePath = join(packageDirectory, 'static', '.prettierignore');
	if (existsFile(prettierIgnorePath)) {
		distribute(prettierIgnorePath);
	} else {
		console.warn(
			`can't distribute ${basename(
				prettierIgnorePath
			)}, it's not present at ${prettierIgnorePath}!`
		);
	}

	const prettierrcPath = join(packageDirectory, 'static', '.prettierrc.cjs');
	if (existsFile(prettierrcPath)) {
		distribute(prettierrcPath, { onlyWorkspaceRoot: true });
	} else {
		console.warn(
			`can't distribute ${basename(prettierrcPath)}, it's not present at ${prettierrcPath}!`
		);
	}
};

distributePrettierConfig();
