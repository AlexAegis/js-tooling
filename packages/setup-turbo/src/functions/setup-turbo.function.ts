import { createLogger } from '@alexaegis/logging';
import {
	distributeFileInWorkspace,
	DistributeInWorkspaceOptions,
	distributePackageJsonItemsInWorkspace,
	getWorkspaceRoot,
	NODE_MODULES_DIRECTORY_NAME,
	normalizeDistributeInWorkspaceOptions,
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
					build: 'turbo run build-lib_ build-app_',
					'build-lib': 'turbo run build-lib_',
					'full-suite': 'turbo run full-suite_',
					lint: 'turbo run lint_',
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
