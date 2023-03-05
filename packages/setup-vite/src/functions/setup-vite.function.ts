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
		...packageJson.name.split('/')
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
					build: undefined,
					build_: undefined,
					'build-lib': 'turbo run build-lib_ --concurrency 6 --filter ${packageName}',
					'build-lib_': 'vite build',
				},
				devDependencies: {
					['@alexaegis/vite']: packageJson.devDependencies['@alexaegis/vite'],
				},
			},
			{
				...options,
				skipWorkspaceRoot: true,
				keywordCriteria: [`${packageJson.name}-lib`],
				logger: logger.getSubLogger({ name: 'packageJson:libraries' }),
			}
		),
		distributePackageJsonItemsInWorkspace(
			{
				scripts: {
					build: undefined,
					build_: undefined,
					'build-app': 'turbo run build-app_ --concurrency 6 --filter ${packageName}',
					'build-app_': 'vite build',
					dev: 'concurrently npm:watch-deps npm:start',
					'watch-deps':
						"nodemon --watch ./node_modules/**/src/**/* --ext ts,tsx,mts,cts,svelte,js,jsx,mjs,cjs,json --ignore dist --exec 'turbo run build_ --concurrency 6 --filter ${packageName}'",
					start: 'vite',
				},
				devDependencies: {
					['@alexaegis/vite']: packageJson.devDependencies['@alexaegis/vite'],
				},
			},
			{
				...options,
				skipWorkspaceRoot: true,
				keywordCriteria: [`${packageJson.name}-(?!lib).*`],
				logger: logger.getSubLogger({ name: 'packageJson:applications' }),
			}
		),
		distributePackageJsonItemsInWorkspace(
			{
				scripts: {
					build: 'turbo run build-lib_ build-app_',
					'build-lib': 'turbo run build-lib_',
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
