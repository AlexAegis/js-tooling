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
					'setup-all':
						'setup-prettier && setup-editorconfig && setup-husky && setup-git && setup-commitlint && setup-eslint && setup-github && setup-ts && setup-remark && setup-standard-version && setup-stylelint && setup-depcheck && setup-turbo && setup-vite && setup-publint && setup-svelte && setup-vitest && setup-workspace',
				},
				devDependencies: {
					'@alexaegis/nuke': packageJson.devDependencies['@alexaegis/nuke'],
					'@alexaegis/autotool-plugin-commitlint': `^${packageJson.version}`, // versioned together
					'@alexaegis/autotool-plugin-depcheck': `^${packageJson.version}`, // versioned together
					'@alexaegis/setup-editorconfig': `^${packageJson.version}`, // versioned together
					'@alexaegis/setup-eslint': `^${packageJson.version}`, // versioned together
					'@alexaegis/setup-git': `^${packageJson.version}`, // versioned together
					'@alexaegis/setup-github': `^${packageJson.version}`, // versioned together
					'@alexaegis/setup-husky': `^${packageJson.version}`, // versioned together
					'@alexaegis/autotool-plugin-prettier': `^${packageJson.version}`, // versioned together
					'@alexaegis/setup-remark': `^${packageJson.version}`, // versioned together
					'@alexaegis/setup-standard-version': `^${packageJson.version}`, // versioned together
					'@alexaegis/setup-stylelint': `^${packageJson.version}`, // versioned together
					'@alexaegis/autotool-plugin-ts': `^${packageJson.version}`, // versioned together
					'@alexaegis/setup-turbo': `^${packageJson.version}`, // versioned together
					'@alexaegis/setup-vite': `^${packageJson.version}`, // versioned together
					'@alexaegis/setup-vitest': `^${packageJson.version}`, // versioned together
					'@alexaegis/setup-vscode': `^${packageJson.version}`, // versioned together
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
