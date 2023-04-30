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
		forFlavour('svelte-app'),
		forFlavour('svelte-lib'),
		forFlavour('lib'),
		distributePackageJsonItemsInWorkspace(
			{
				scripts: {
					build: 'turbo run build-lib_ --concurrency 32 --cache-dir .cache/turbo --filter ${packageName}',
					build_: undefined,
					'build-lib': undefined,
					'build-lib_': 'vite build',
				},
				devDependencies: {
					['@alexaegis/vite']: packageJson.devDependencies['@alexaegis/vite'],
					vite: packageJson.dependencies.vite,
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
					build: 'turbo run build-app_ --concurrency 32 --cache-dir .cache/turbo --filter ${packageName}',
					build_: undefined,
					'build-app': undefined,
					'build-app_': 'vite build',
					dev: 'concurrently npm:watch-deps npm:start',
					'watch-deps':
						"TARGET_ENV='local' nodemon --config ${relativePathFromPackageToRoot}/node_modules/@alexaegis/setup-vite/static/nodemon.json --watch ./node_modules/**/src/**/* --ext ts,tsx,mts,cts,svelte,js,jsx,mjs,cjs,json --ignore dist --exec 'turbo run build-lib_ --concurrency 32 --cache-dir .cache/turbo --filter ${packageName}'",
					start: 'vite',
				},
				devDependencies: {
					['@alexaegis/vite']: packageJson.devDependencies['@alexaegis/vite'],
					nodemon: packageJson.dependencies.nodemon,
					concurrently: packageJson.dependencies.concurrently,
					vite: packageJson.dependencies.vite,
				},
			},
			{
				...options,
				skipWorkspaceRoot: true,
				keywordCriteria: [`${packageJson.name}-(?!lib|svelte-lib).*`],
				logger: logger.getSubLogger({ name: 'packageJson:applications' }),
			}
		),
	]);

	logger.info(`finished in ${Math.floor(performance.now() - startTime)}ms`);
};
