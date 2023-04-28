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

export const setupStylelint = async (rawOptions?: DistributeInWorkspaceOptions): Promise<void> => {
	const options = normalizeDistributeInWorkspaceOptions(rawOptions);
	const startTime = performance.now();
	const workspaceRoot = getWorkspaceRoot(options.cwd);
	const logger = createLogger({ name: 'setup:stylelint' });

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
			join(packageDirectory, 'static', 'stylelint.config.cjs'),
			'.stylelintrc.cjs',
			{
				...options,
				skipWorkspaceRoot: true,
				dependencyCriteria: [packageJson.name],
				logger: logger.getSubLogger({ name: 'stylelintrc' }),
			}
		),
		distributeFileInWorkspace(
			join(packageDirectory, 'static', 'stylelintignore'),
			'.stylelintignore',
			{
				...options,
				skipWorkspaceRoot: true,
				dependencyCriteria: [packageJson.name],
				logger: logger.getSubLogger({ name: 'stylelintrc' }),
			}
		),
		distributePackageJsonItemsInWorkspace(
			{
				scripts: {
					'lint:style': 'turbo run lint:style_ --concurrency 32 --cache-dir .cache/turbo',
					'lint:style:css':
						'turbo run lint:style:css_ --concurrency 32 --cache-dir .cache/turbo',
					'lint:style:scss':
						'turbo run lint:style:scss_ --concurrency 32 --cache-dir .cache/turbo',
				},
				devDependencies: {
					'@alexaegis/stylelint-config': `^${packageJson.version}`,
					stylelint: packageJson.devDependencies.stylelint,
					'postcss-scss': packageJson.devDependencies['postcss-scss'],
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
					'lint:style':
						'turbo run lint:style_ --concurrency 32 --cache-dir .cache/turbo --filter ${packageName}',
					'lint:style:css':
						'turbo run lint:style:css_ --concurrency 32 --cache-dir .cache/turbo --filter ${packageName}',
					'lint:style:css_':
						'stylelint --cache true --cache-strategy content --cache-location .cache/stylelintcache-css ./**/*.css',
					'lint:style:scss':
						'turbo run lint:style:scss_ --concurrency 32 --cache-dir .cache/turbo --filter ${packageName}',
					'lint:style:scss_':
						'stylelint --customSyntax=postcss-scss --cache true --cache-strategy content --cache-location .cache/stylelintcache-scss ./**/*.scss',
				},
				devDependencies: {
					'@alexaegis/stylelint-config': `^${packageJson.version}`,
					stylelint: packageJson.devDependencies.stylelint,
					'postcss-scss': packageJson.devDependencies['postcss-scss'],
				},
			},
			{
				...options,
				skipWorkspaceRoot: true,
				keywordCriteria: [packageJson.name],
				logger: logger.getSubLogger({ name: 'packageJson:workspace' }),
			}
		),
	]);

	logger.info(`finished in ${Math.floor(performance.now() - startTime)}ms`);
};
