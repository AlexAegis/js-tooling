import { contains, equal, not, or } from '@alexaegis/predicate';
import { type AutotoolPlugin, type AutotoolPluginObject } from 'autotool-plugin';
import { join } from 'node:path';
import packageJson from '../package.json';

const appOrLib = or(equal('app'), equal('lib'));

export const plugin: AutotoolPlugin = (_options): AutotoolPluginObject => {
	return {
		name: packageJson.name,
		elements: [
			{
				description: 'workspace test scripts and devDependencies',
				executor: 'packageJson',
				packageKind: 'root',
				data: {
					scripts: {
						test: 'turbo run test_ --concurrency 16 --cache-dir .cache/turbo && merge-workspace-lcov-reports && lcov-viewer lcov -o ./coverage ./coverage/lcov.info',
					},
					devDependencies: {
						'@vitest/coverage-v8': packageJson.devDependencies['@vitest/coverage-v8'],
						'@lcov-viewer/cli': packageJson.devDependencies['@lcov-viewer/cli'],
						'@alexaegis/coverage-tools':
							packageJson.dependencies['@alexaegis/coverage-tools'],
					},
				},
			},
			{
				description: 'package test scripts',
				executor: 'packageJson',
				packageKind: 'regular',
				packageJsonFilter: {
					archetype: {
						kind: appOrLib,
					},
				},
				data: {
					scripts: {
						test: 'turbo run test_ --concurrency 16 --cache-dir .cache/turbo --filter ${packageName}',
						test_: 'vitest --passWithNoTests --coverage --run',
						'test:watch': 'vitest --passWithNoTests --coverage',
					},
				},
			},
			{
				description: 'package test devDependencies',
				executor: 'packageJson',
				packageKind: 'regular',
				packageJsonFilter: {
					name: not(or(equal('@alexaegis/vite'), equal('@alexaegis/vitest'))), // Don't add it for itself and 'vite' it would cause a circle
					archetype: {
						kind: appOrLib,
					},
				},
				data: {
					devDependencies: {
						'@alexaegis/vitest': packageJson.devDependencies['@alexaegis/vitest'],
						vitest: packageJson.devDependencies.vitest,
					},
				},
			},
			{
				description: 'package vitest config file for web packages',
				executor: 'fileCopy',
				packageJsonFilter: {
					archetype: {
						kind: appOrLib,
						platform: 'web',
						framework: not(contains('svelte')),
					},
				},
				packageKind: 'regular',
				formatWithPrettier: true,
				sourceFile: join('static', 'package-web-vitest.config.ts'),
				targetFile: 'vitest.config.ts',
				sourcePluginPackageName: packageJson.name,
			},

			{
				description: 'package vitest config file for node packages',
				executor: 'fileCopy',
				packageJsonFilter: {
					archetype: {
						kind: appOrLib,
						platform: 'node',
						framework: not(contains('svelte')),
					},
				},
				packageKind: 'regular',
				formatWithPrettier: true,
				sourceFile: join('static', 'package-node-vitest.config.ts'),
				targetFile: 'vitest.config.ts',
				sourcePluginPackageName: packageJson.name,
			},
			{
				description: 'package vitest config file for svelte packages',
				executor: 'fileCopy',
				packageJsonFilter: {
					archetype: {
						kind: appOrLib,
						framework: 'svelte',
					},
				},
				packageKind: 'regular',
				formatWithPrettier: true,
				sourceFile: join('static', 'package-svelte-vitest.config.ts'),
				targetFile: 'vitest.config.ts',
				sourcePluginPackageName: packageJson.name,
			},
		],
	};
};

export default plugin;
