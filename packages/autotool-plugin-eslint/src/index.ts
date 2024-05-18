import { contains, equal, not, or } from '@alexaegis/predicate';
import { type AutotoolPlugin, type AutotoolPluginObject } from 'autotool-plugin';
import { join } from 'node:path';
import packageJson from '../package.json';

export const plugin: AutotoolPlugin = (_options): AutotoolPluginObject => {
	return {
		name: packageJson.name,
		elements: [
			{
				description: 'workspace eslint config',
				executor: 'fileCopy',
				packageKind: 'root',
				formatWithPrettier: true,
				targetFile: 'eslint.config.js',
				sourcePluginPackageName: packageJson.name,
				templateVariables: {
					imports: `import eslintConfigCore from '@alexaegis/eslint-config-core';`,
					configs: '[...eslintConfigCore]',
				},
				sourceFile: join('static', 'eslint.config.js.txt'),
			},
			{
				description: 'delete the deprecated eslintignore files',
				executor: 'fileRemove',
				targetFile: '.eslintignore',
			},
			{
				description: 'delete the deprecated eslintrc files',
				executor: 'fileRemove',
				targetFile: '.eslintrc.cjs',
			},
			{
				description: 'package eslint config (non svelte)',
				executor: 'fileCopy',
				packageKind: 'regular',
				formatWithPrettier: true,
				targetFile: 'eslint.config.js',
				packageJsonFilter: {
					name: not(or(equal('@alexaegis/vite'), equal('@alexaegis/vitest'))), // Skip these libraries to avoid circular dependencies
					archetype: {
						framework: not(contains('svelte')),
					},
				},
				sourcePluginPackageName: packageJson.name,
				templateVariables: {
					imports: `import eslintConfigCore from '@alexaegis/eslint-config-core';
import eslintConfigVitest from "@alexaegis/eslint-config-vitest";`,
					configs: '[...eslintConfigCore, ...eslintConfigVitest]',
				},
				sourceFile: join('static', 'eslint.config.js.txt'),
			},
			{
				description: 'package eslint config (svelte)',
				executor: 'fileCopy',
				packageKind: 'regular',
				formatWithPrettier: true,
				targetFile: 'eslint.config.js',
				packageJsonFilter: {
					name: not(or(equal('@alexaegis/vite'), equal('@alexaegis/vitest'))), // Skip these libraries to avoid circular dependencies
					archetype: {
						framework: 'svelte',
					},
				},
				sourcePluginPackageName: packageJson.name,
				templateVariables: {
					imports: `import eslintConfigCore from '@alexaegis/eslint-config-core';
import eslintConfigSvelte from "@alexaegis/eslint-config-svelte";
import eslintConfigVitest from "@alexaegis/eslint-config-vitest";`,
					configs: '[...eslintConfigCore, ...eslintConfigSvelte, ...eslintConfigVitest]',
				},
				sourceFile: join('static', 'eslint.config.js.txt'),
			},
			{
				description: 'package eslint dependencies (vitest)',
				executor: 'packageJson',
				packageKind: 'regular',
				packageJsonFilter: {
					name: not(
						or(
							equal('@alexaegis/eslint-config-vitest'),
							equal('@alexaegis/vite'),
							equal('@alexaegis/vitest'),
						),
					),
				},
				data: {
					devDependencies: {
						'@alexaegis/eslint-config-vitest':
							packageJson.devDependencies['@alexaegis/eslint-config-vitest'],
					},
				},
			},
			// TODO: Fix: https://github.com/AlexAegis/autotool/issues/7
			//{
			//	description: 'package eslint dependencies (svelte)',
			//	executor: 'packageJson',
			//	packageKind: 'regular',
			//	packageJsonFilter: {
			//		archetype: {
			//			framework: 'svelte',
			//		},
			//	},
			//	data: {
			//		devDependencies: {
			//			'@alexaegis/eslint-config-svelte': `^${packageJson.version}`, // Versioned together, it's fine
			//		},
			//	},
			//},
			{
				description: 'package eslint config (For @alexaegis/vitest only)',
				executor: 'fileCopy',
				packageKind: 'regular',
				formatWithPrettier: true,
				targetFile: 'eslint.config.js',
				packageJsonFilter: {
					name: /^@alexaegis\/vite(st)?$/,
				},
				templateVariables: {
					imports: `import eslintConfigCore from '@alexaegis/eslint-config-core';`,
					configs: '[...eslintConfigCore]',
				},
				sourcePluginPackageName: packageJson.name,
				sourceFile: join('static', 'eslint.config.js.txt'),
			},
			{
				description: 'workspace eslint dependencies',
				executor: 'packageJson',
				packageKind: 'root',
				data: {
					devDependencies: {
						'@alexaegis/eslint-config-core':
							packageJson.devDependencies['@alexaegis/eslint-config-core'],
						eslint: packageJson.devDependencies.eslint,
						'@types/eslint': packageJson.devDependencies['@types/eslint'],
					},
				},
			},
			{
				description: 'workspace eslint scripts',
				executor: 'packageJson',
				packageKind: 'root',
				data: {
					scripts: {
						'lint:es': 'turbo run lint:es_ --concurrency 16 --cache-dir .cache/turbo',
					},
				},
			},
			{
				description: 'package eslint scripts',
				executor: 'packageJson',
				packageKind: 'regular',
				data: {
					scripts: {
						'lint:es':
							'turbo run lint:es_ --concurrency 16 --cache-dir .cache/turbo --filter ${packageName}',
						'lint:es_':
							'eslint --max-warnings=0 --fix --no-error-on-unmatched-pattern .',
					},
				},
			},
		],
	};
};

export default plugin;
