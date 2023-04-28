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

export const setupSvelte = async (rawOptions?: DistributeInWorkspaceOptions): Promise<void> => {
	const options = normalizeDistributeInWorkspaceOptions(rawOptions);
	const startTime = performance.now();
	const workspaceRoot = getWorkspaceRoot(options.cwd);
	const logger = createLogger({ name: 'distribute:svelte' });

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
		distributeFileInWorkspace(
			join(packageDirectory, 'static', 'svelte.config.txt'),
			'svelte.config.js',
			{
				...options,
				skipWorkspaceRoot: true,
				keywordCriteria: [packageJson.name],
				logger: logger.getSubLogger({ name: 'svelteConfig' }),
			}
		),
		distributePackageJsonItemsInWorkspace(
			{
				scripts: {
					start: "TARGET_ENV='local' vite",
				},
				devDependencies: {
					svelte: packageJson.dependencies.svelte,
					'svelte-check': packageJson.dependencies['svelte-check'],
					'svelte-preprocess': packageJson.dependencies['svelte-preprocess'],
					'@sveltejs/kit': packageJson.dependencies['@sveltejs/kit'],
				},
			},
			{
				...options,
				skipWorkspaceRoot: true,
				keywordCriteria: [packageJson.name],
				logger: logger.getSubLogger({ name: 'packageJson' }),
			}
		),
	]);

	logger.info(`finished in ${Math.floor(performance.now() - startTime)}ms`);
};
