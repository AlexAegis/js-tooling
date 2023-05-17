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
				targetFile: '.eslintrc.cjs',
				sourcePluginPackageName: packageJson.name,
				sourceFile: join('static', 'workspace-eslintrc.cjs'),
			},
			{
				description: 'workspace eslintignore',
				executor: 'fileCopy',
				packageKind: 'root',
				targetFile: '.eslintignore',
				sourcePluginPackageName: packageJson.name,
				sourceFile: join('static', 'eslintignore.txt'),
			},
			{
				description: 'package eslintignore',
				executor: 'fileCopy',
				packageKind: 'regular',
				targetFile: '.eslintignore',
				sourcePluginPackageName: packageJson.name,
				sourceFile: join('static', 'eslintignore.txt'),
			},
			{
				description: 'package eslint config',
				executor: 'fileCopy',
				packageKind: 'regular',
				targetFile: '.eslintrc.cjs',
				packageJsonFilter: {
					archetype: {
						testing: /^(?!vitest).*$/, // fallback option!
					},
				},
				sourcePluginPackageName: packageJson.name,
				sourceFile: join('static', 'package-eslintrc.cjs'),
			},
			{
				description: 'package eslint config (vitest)',
				executor: 'fileCopy',
				packageKind: 'regular',
				targetFile: '.eslintrc.cjs',
				packageJsonFilter: {
					name: /^(?!@alexaegis\/vite(st)?).*$/,
					archetype: {
						testing: 'vitest',
					},
				},
				sourcePluginPackageName: packageJson.name,
				sourceFile: join('static', 'package-eslintrc-vitest.cjs'),
			},
			{
				description: 'package eslint config (vitest patch to break circular dependencies)',
				executor: 'fileCopy',
				packageKind: 'regular',
				targetFile: '.eslintrc.cjs',
				packageJsonFilter: {
					name: /^@alexaegis\/vite(st)?$/,
					archetype: {
						testing: 'vitest',
					},
				},
				sourcePluginPackageName: packageJson.name,
				sourceFile: join('static', 'package-eslintrc.cjs'),
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
