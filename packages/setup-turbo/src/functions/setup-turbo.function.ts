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

export const setupTurbo = async (rawOptions?: DistributeInWorkspaceOptions): Promise<void> => {
	const options = normalizeDistributeInWorkspaceOptions(rawOptions);
	const startTime = performance.now();
	const workspaceRoot = getWorkspaceRoot(options.cwd);
	const logger = createLogger({ name: 'setup:turbo' });

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

	await Promise.all([
		distributePackageJsonItemsInWorkspace(
			{
				scripts: {
					build: 'turbo run build-lib_ build-app_ --concurrency 32 --cache-dir .cache/turbo',
					'build-lib': 'turbo run build-lib_ --concurrency 32 --cache-dir .cache/turbo',
					ce: 'turbo run ce_ --concurrency 32 --cache-dir .cache/turbo',
					lint: 'turbo run lint_ --concurrency 32 --cache-dir .cache/turbo',
				},
				devDependencies: {
					turbo: packageJson.dependencies.turbo,
				},
			},
			{
				...options,
				onlyWorkspaceRoot: true,
				dependencyCriteria: [packageJson.name],
				logger: logger.getSubLogger({ name: 'packageJson:workspace' }),
			}
		),
		distributeFileInWorkspace(join(packageDirectory, 'static', 'turbo.json'), 'turbo.json', {
			...options,
			onlyWorkspaceRoot: true,
			dependencyCriteria: [packageJson.name],
			logger: logger.getSubLogger({ name: 'turbojson' }),
		}),
	]);

	logger.info(`finished in ${Math.floor(performance.now() - startTime)}ms`);
};
