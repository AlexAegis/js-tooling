import { equal, not, or } from '@alexaegis/predicate';
import { type AutotoolPlugin, type AutotoolPluginObject } from 'autotool-plugin';
import { join } from 'node:path';
import packageJson from '../package.json';

/**
 * @returns a string like ", 'foo', 'bar', 'amogus'"
 */
export const joinAdditionalExtends = (...pluginNames: string[]): string => {
	return pluginNames.length > 0 ? `, '${pluginNames.join("', '")}'` : '';
};

export const plugin: AutotoolPlugin = (_options): AutotoolPluginObject => {
	return {
		name: packageJson.name,
		elements: [
			{
				description: 'workspace eslint config',
				executor: 'fileCopy',
				packageKind: 'root',
				formatWithPrettier: true,
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
				description: 'package eslint config (vitest)',
				executor: 'fileCopy',
				packageKind: 'regular',
				formatWithPrettier: true,
				targetFile: '.eslintrc.cjs',
				packageJsonFilter: {
					name: not(or(equal('@alexaegis/vite'), equal('@alexaegis/vitest'))),
				},
				sourcePluginPackageName: packageJson.name,
				templateVariables: {
					additionalExtends: joinAdditionalExtends('@alexaegis/eslint-config-vitest'),
				},
				sourceFile: join('static', 'package-eslintrc.cjs.txt'),
			},
			{
				description: 'package eslint dependencies (vitest)',
				executor: 'packageJson',
				packageKind: 'regular',
				packageJsonFilter: {
					name: /^(?!@alexaegis\/(eslint-config-)?vite(st)?).*$/,
				},
				data: {
					devDependencies: {
						'@alexaegis/eslint-config-vitest':
							packageJson.devDependencies['@alexaegis/eslint-config-vitest'],
					},
				},
			},
			{
				description: 'package eslint config (For @alexaegis/vitest only)',
				executor: 'fileCopy',
				packageKind: 'regular',
				formatWithPrettier: true,
				targetFile: '.eslintrc.cjs',
				packageJsonFilter: {
					name: /^@alexaegis\/vite(st)?$/,
				},
				templateVariables: {
					additionalExtends: joinAdditionalExtends(), // No extra config here
				},
				sourcePluginPackageName: packageJson.name,
				sourceFile: join('static', 'package-eslintrc.cjs.txt'),
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
