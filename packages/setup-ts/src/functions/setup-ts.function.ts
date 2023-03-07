import { createLogger } from '@alexaegis/logging';
import {
	distributeFileInWorkspace,
	DistributeInWorkspaceOptions,
	distributePackageJsonItemsInWorkspace,
	getWorkspaceRoot,
	NODE_MODULES_DIRECTORY_NAME,
	normalizeDistributeInWorkspaceOptions,
	removeFilesInWorkspace,
} from '@alexaegis/workspace-tools';
import { join } from 'node:path';
import packageJson from '../../package.json';

export const setupTs = async (rawOptions?: DistributeInWorkspaceOptions): Promise<void> => {
	const options = normalizeDistributeInWorkspaceOptions(rawOptions);

	const startTime = performance.now();
	const workspaceRoot = getWorkspaceRoot(options.cwd);
	const logger = createLogger({ name: 'distribute:ts' });

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

	const forFlavour = (flavour: string): Promise<void>[] => {
		const flavourCriteria = flavour === 'base' ? '' : `-${flavour}`;

		const commonOptions = {
			...options,
			skipWorkspaceRoot: true,
			keywordCriteria: [`^${packageJson.name}${flavourCriteria}$`],
			logger: logger.getSubLogger({ name: `packageTsConfig:${flavour}` }),
		};

		return [
			distributeFileInWorkspace(
				join(packageDirectory, 'static', 'package-simple-tsconfig.json'),
				'tsconfig.json',
				{
					...commonOptions,
					templateVariables: {
						flavour,
					},
				}
			),
		];
	};

	await removeFilesInWorkspace('tsconfig.!(json)', {
		...options,
		keywordCriteria: [`${packageJson.name}.*`],
		logger: logger.getSubLogger({ name: 'packageJson' }),
	});

	await Promise.all([
		distributePackageJsonItemsInWorkspace(
			{
				scripts: {
					'lint:tsc': 'turbo run lint:tsc_ --concurrency 6 --filter ${packageName}',
					'lint:tsc_': 'tsc --noEmit',
				},
			},
			{
				...options,
				skipWorkspaceRoot: true,
				keywordCriteria: [packageJson.name],
				logger: logger.getSubLogger({ name: 'packageJson' }),
			}
		),
		distributePackageJsonItemsInWorkspace(
			{
				scripts: {
					'lint:tsc': 'turbo run lint:tsc_ --concurrency 6',
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
			join(packageDirectory, 'static', 'workspace-tsconfig.json'),
			'tsconfig.json',
			{
				...options,
				onlyWorkspaceRoot: true,
				dependencyCriteria: [packageJson.name],
				logger: logger.getSubLogger({ name: 'workspaceTsConfig' }),
			}
		),
		...forFlavour('base'),
		...forFlavour('node'),
		...forFlavour('web'),
		...forFlavour('svelte'),
	]);

	logger.info(`finished in ${Math.floor(performance.now() - startTime)}ms`);
};
