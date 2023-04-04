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

export const setupStandardVersion = async (
	rawOptions?: DistributeInWorkspaceOptions
): Promise<void> => {
	const options = normalizeDistributeInWorkspaceOptions(rawOptions);
	const startTime = performance.now();
	const workspaceRoot = getWorkspaceRoot(options.cwd);
	const logger = createLogger({ name: 'setup:standard-version' });

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
					release: 'commit-and-tag-version --sign --commit-all',
					'release:patch':
						'commit-and-tag-version --sign --commit-all --release-as patch',
					'release:minor':
						'commit-and-tag-version --sign --commit-all --release-as minor',
					'release:major':
						'commit-and-tag-version --sign --commit-all --release-as major',
					precommit: 'pnpm install',
				},
				devDependencies: {
					'commit-and-tag-version': packageJson.dependencies['commit-and-tag-version'],
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
			join(packageDirectory, 'static', '.versionrc.cjs.txt'),
			'.versionrc.cjs',
			{
				...options,
				onlyWorkspaceRoot: true,
				dependencyCriteria: [packageJson.name],
				logger: logger.getSubLogger({ name: 'standard-version' }),
			}
		),
	]);

	logger.info(`finished in ${Math.floor(performance.now() - startTime)}ms`);
};
