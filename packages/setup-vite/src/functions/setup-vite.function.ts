import { createLogger } from '@alexaegis/logging';
import {
	distributeFileInWorkspace,
	DistributeInWorkspaceOptions,
	distributePackageJsonItemsInWorkspace,
	getWorkspaceRoot,
	NODE_MODULES_DIRECTORY_NAME,
	normalizeDistributeInWorkspaceOptions,
} from '@alexaegis/workspace-tools';
import { join, posix } from 'node:path';
import packageJson from '../../package.json';

export const setupVite = async (rawOptions?: DistributeInWorkspaceOptions): Promise<void> => {
	const options = normalizeDistributeInWorkspaceOptions(rawOptions);
	const startTime = performance.now();
	const workspaceRoot = getWorkspaceRoot(options.cwd);
	const logger = createLogger({ name: 'distribute:vite' });

	if (!workspaceRoot) {
		console.warn("can't distribute config, not in a workspace!");
		return;
	}

	const packageDirectory = join(
		workspaceRoot,
		NODE_MODULES_DIRECTORY_NAME,
		...packageJson.name.split(posix.sep)
	);
	logger.info(`distributing config from ${packageDirectory}`);

	const forFlavour = (flavour: string): Promise<void> => {
		const flavourCriteria = flavour === 'base' ? '' : `-${flavour}`;

		return distributeFileInWorkspace(
			join(packageDirectory, 'static', `vite${flavourCriteria}.config.ts`),
			'vite.config.ts',
			{
				...options,
				skipWorkspaceRoot: true,
				keywordCriteria: [`${packageJson.name}${flavourCriteria}`],
				logger: logger.getSubLogger({ name: `viteConfig:${flavour}` }),
				templateVariables: {
					flavour,
				},
			}
		);
	};

	await Promise.all([
		forFlavour('svelte'),
		forFlavour('lib'),
		distributePackageJsonItemsInWorkspace(
			{
				scripts: {
					build: 'turbo run build_ --concurrency 6 --filter ${packageName}',
					build_: 'vite build',
				},
				devDependencies: {
					['@alexaegis/vite']: packageJson.devDependencies['@alexaegis/vite'],
				},
			},
			{
				...options,
				skipWorkspaceRoot: true,
				keywordCriteria: [`${packageJson.name}.*`],
				logger: logger.getSubLogger({ name: 'packageJson' }),
			}
		),
		distributePackageJsonItemsInWorkspace(
			{
				scripts: {
					build: 'turbo run build_',
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
