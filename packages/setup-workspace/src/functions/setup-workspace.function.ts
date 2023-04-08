import { createLogger } from '@alexaegis/logging';
import {
	NODE_MODULES_DIRECTORY_NAME,
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
					ncu: 'ncu --deep --peer --upgrade',
					'setup-all':
						'npx setup-prettier && npx setup-editorconfig && npx setup-husky && npx setup-git && npx setup-commitlint && npx setup-eslint && npx setup-github && npx setup-ts && npx setup-remark && npx setup-standard-version && npx setup-stylelint && npx setup-depcheck && npx setup-turbo && npx setup-vite && npx setup-vitest && npx setup-workspace',
				},
				devDependencies: {
					'@alexaegis/nuke': packageJson.devDependencies['@alexaegis/nuke'],
					'@alexaegis/setup-commitlint': packageJson.version, // versioned together
					'@alexaegis/setup-depcheck': packageJson.version, // versioned together
					'@alexaegis/setup-editorconfig': packageJson.version, // versioned together
					'@alexaegis/setup-eslint': packageJson.version, // versioned together
					'@alexaegis/setup-git': packageJson.version, // versioned together
					'@alexaegis/setup-github': packageJson.version, // versioned together
					'@alexaegis/setup-husky': packageJson.version, // versioned together
					'@alexaegis/setup-prettier': packageJson.version, // versioned together
					'@alexaegis/setup-remark': packageJson.version, // versioned together
					'@alexaegis/setup-standard-version': packageJson.version, // versioned together
					'@alexaegis/setup-stylelint': packageJson.version, // versioned together
					'@alexaegis/setup-ts': packageJson.version, // versioned together
					'@alexaegis/setup-turbo': packageJson.version, // versioned together
					'@alexaegis/setup-vite': packageJson.version, // versioned together
					'@alexaegis/setup-vitest': packageJson.version, // versioned together
					'@alexaegis/setup-vscode': packageJson.version, // versioned together
					'@alexaegis/setup-workspace': packageJson.version, // versioned together
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
	]);

	logger.info(`finished in ${Math.floor(performance.now() - startTime)}ms`);
};
