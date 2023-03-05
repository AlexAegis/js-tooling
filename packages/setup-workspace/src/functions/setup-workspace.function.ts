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

	// TODO: once release add `nuke` to the dependencies and it's bin to this packages bin
	await Promise.allSettled([
		distributePackageJsonItemsInWorkspace(
			{
				scripts: {
					nuke: 'nuke',
				},
				devDependencies: {
					'@alexaegis/setup-editorconfig': `${packageJson.version}`,
					'@alexaegis/setup-eslint': `${packageJson.version}`,
					'@alexaegis/setup-git': `${packageJson.version}`,
					'@alexaegis/setup-husky': `${packageJson.version}`,
					'@alexaegis/setup-prettier': `${packageJson.version}`,
					'@alexaegis/setup-remark': `${packageJson.version}`,
					'@alexaegis/setup-standard-version': `${packageJson.version}`,
					'@alexaegis/setup-stylelint': `${packageJson.version}`,
					'@alexaegis/setup-ts': `${packageJson.version}`,
					'@alexaegis/setup-turbo': `${packageJson.version}`,
					'@alexaegis/setup-vite': `${packageJson.version}`,
					'@alexaegis/setup-vitest': `${packageJson.version}`,
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
					'watch-deps':
						'nodemon --config node_modules/@alexaegis/workspace-tools/static/nodemon-dep-watch.json',
				},
			},
			{
				...options,
				skipWorkspaceRoot: true,
				keywordCriteria: [/@alexaegis\/setup-vite.*/g],
				logger: logger.getSubLogger({ name: 'packageJson:subPackages' }),
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
