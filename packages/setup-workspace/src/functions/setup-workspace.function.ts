import { createLogger } from '@alexaegis/logging';
import {
	NODE_MODULES_DIRECTORY_NAME,
	distributeFileInWorkspace,
	distributePackageJsonItemsInWorkspace,
	getWorkspaceRoot,
	normalizeDistributeInWorkspaceOptions,
	type DistributeInWorkspaceOptions,
} from '@alexaegis/workspace-tools';
import { join } from 'node:path';
import packageJson from '../../package.json';

export const setupWorkspace = async (rawOptions?: DistributeInWorkspaceOptions): Promise<void> => {
	const options = normalizeDistributeInWorkspaceOptions(rawOptions);
	const startTime = performance.now();
	const workspaceRoot = getWorkspaceRoot(options.cwd);
	const logger = createLogger({ name: 'setup:setup-workspace' });

	if (!workspaceRoot) {
		console.warn("can't distribute config, not in a workspace!");
		return;
	}

	const packageDirectory = join(
		workspaceRoot,
		NODE_MODULES_DIRECTORY_NAME,
		...packageJson.name.split('/')
	);
	logger.info(`distributing config from ${packageDirectory}`);

	await Promise.allSettled([
		distributePackageJsonItemsInWorkspace(
			{
				scripts: {
					nuke: 'nuke',
					ncu: 'ncu --deep --peer --upgrade && pnpm up',
				},
				devDependencies: {
					'@alexaegis/nuke': packageJson.devDependencies['@alexaegis/nuke'],
					'@alexaegis/autotool-plugin-commitlint': `^${packageJson.version}`, // versioned together
					'@alexaegis/autotool-plugin-depcheck': `^${packageJson.version}`, // versioned together
					'@alexaegis/autotool-plugin-editorconfig': `^${packageJson.version}`, // versioned together
					'@alexaegis/autotool-plugin-eslint': `^${packageJson.version}`, // versioned together
					'@alexaegis/autotool-plugin-git': `^${packageJson.version}`, // versioned together
					'@alexaegis/autotool-plugin-github': `^${packageJson.version}`, // versioned together
					'@alexaegis/autotool-plugin-husky': `^${packageJson.version}`, // versioned together
					'@alexaegis/autotool-plugin-prettier': `^${packageJson.version}`, // versioned together
					'@alexaegis/autotool-plugin-remark': `^${packageJson.version}`, // versioned together
					'@alexaegis/autotool-plugin-standard-version': `^${packageJson.version}`, // versioned together
					'@alexaegis/autotool-plugin-stylelint': `^${packageJson.version}`, // versioned together
					'@alexaegis/autotool-plugin-svelte': `^${packageJson.version}`, // versioned together
					'@alexaegis/autotool-plugin-turbo': `^${packageJson.version}`, // versioned together
					'@alexaegis/autotool-plugin-ts': `^${packageJson.version}`, // versioned together
					'@alexaegis/autotool-plugin-typedoc': `^${packageJson.version}`, // versioned together
					'@alexaegis/autotool-plugin-vite': `^${packageJson.version}`, // versioned together
					'@alexaegis/autotool-plugin-vitest': `^${packageJson.version}`, // versioned together
					'@alexaegis/autotool-plugin-vscode': `^${packageJson.version}`, // versioned together
					'@alexaegis/setup-workspace': `^${packageJson.version}`, // versioned together
					'npm-check-updates': packageJson.dependencies['npm-check-updates'],
				},
			},
			{
				...options,
				onlyWorkspaceRoot: true,
				dependencyCriteria: [packageJson.name],
				logger: logger.getSubLogger({ name: 'packageJson:workspace' }),
			}
		),
		distributeFileInWorkspace(
			join(packageDirectory, 'static', 'pnpm-workspace.yaml'),
			'pnpm-workspace.yaml',
			{
				...options,
				onlyWorkspaceRoot: true,
				dependencyCriteria: [packageJson.name],
				logger: logger.getSubLogger({ name: 'pnpm-workspace' }),
			}
		),
	]);

	logger.info(`finished in ${Math.floor(performance.now() - startTime)}ms`);
};
