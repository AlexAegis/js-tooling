import { type AutotoolPlugin, type AutotoolPluginObject } from 'autotool-plugin';
import { join } from 'node:path';
import packageJson from '../package.json';

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
						test: 'turbo run test_ --concurrency 16 --cache-dir .cache/turbo',
						'merge-coverage':
							'merge-workspace-lcov-reports && lcov-viewer lcov -o ./coverage ./coverage/lcov.info',
					},
					devDependencies: {
						'@vitest/coverage-c8': packageJson.devDependencies['@vitest/coverage-c8'],
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
						kind: /^(app|lib)$/,
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
					name: /^(?!@alexaegis\/vite(st)?).*$/, // Don't add it for itself and 'vite' it would cause a circle
					archetype: {
						kind: /^(app|lib)$/,
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
						kind: /^(app|lib)$/,
						platform: 'web',
						framework: /^(?!svelte).*$/,
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
						kind: /^(app|lib)$/,
						platform: 'node',
						framework: /^(?!svelte).*$/,
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
						kind: /^(app|lib)$/,
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
