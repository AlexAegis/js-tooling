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

export const setupTypedoc = async (rawOptions?: DistributeInWorkspaceOptions): Promise<void> => {
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

	// TODO: If typedoc can do the entire monorepo in one go, it could be called at the root only
	await Promise.allSettled([
		distributePackageJsonItemsInWorkspace(
			{
				scripts: {
					typedoc: 'turbo run typedoc_',
				},
				devDependencies: {
					typedoc: packageJson.dependencies.typedoc,
				},
			},
			{
				...options,
				onlyWorkspaceRoot: true,
				dependencyCriteria: [packageJson.name],
				logger: logger.getSubLogger({ name: 'packageJson:workspace' }),
			}
		),
		distributePackageJsonItemsInWorkspace(
			{
				scripts: {
					typedoc: 'turbo run typedoc_ --concurrency 6 --filter ${packageName}',
					typedoc_: 'typedoc',
				},
			},
			{
				...options,
				skipWorkspaceRoot: true,
				keywordCriteria: [packageJson.name],
				logger: logger.getSubLogger({ name: 'packageJson:package' }),
			}
		),
	]);

	logger.info(`finished in ${Math.floor(performance.now() - startTime)}ms`);
};
