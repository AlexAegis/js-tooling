import type { AutotoolPlugin, AutotoolPluginObject } from 'autotool-plugin';
import { join } from 'node:path';
import packageJson from '../package.json' with { type: 'json' };

export const plugin: AutotoolPlugin = (_options): AutotoolPluginObject => {
	return {
		name: packageJson.name,
		elements: [
			{
				description: 'add husky as a workspace devDependency',
				executor: 'packageJson',
				packageKind: 'root',
				data: {
					devDependencies: {
						husky: packageJson.dependencies.husky,
					},
				},
			},
			{
				description: 'add lint-staged as a workspace devDependency',
				executor: 'packageJson',
				packageKind: 'root',
				data: {
					devDependencies: {
						'lint-staged': packageJson.dependencies['lint-staged'],
					},
				},
			},
			{
				description: 'add @commitlint/config-conventional as a workspace devDependency',
				executor: 'packageJson',
				packageKind: 'root',
				data: {
					devDependencies: {
						'@commitlint/config-conventional':
							packageJson.dependencies['@commitlint/config-conventional'],
					},
				},
			},
			{
				description: 'root lint-staged config',
				executor: 'fileCopy',
				packageKind: 'root',
				formatWithPrettier: true,
				targetFile: 'lint-staged.config.js',
				sourcePluginPackageName: packageJson.name,
				sourceFile: join('static', 'lint-staged.config.js'),
			},
			{
				description: 'husky commit-msg hook',
				executor: 'fileCopy',
				packageKind: 'root',
				targetFile: join('.husky', 'commit-msg'),
				sourcePluginPackageName: packageJson.name,
				sourceFile: join('static', '.husky', 'commit-msg'),
				markAsExecutable: true,
			},
			{
				description: 'husky pre-commit hook',
				executor: 'fileCopy',
				packageKind: 'root',
				targetFile: join('.husky', 'pre-commit'),
				sourcePluginPackageName: packageJson.name,
				sourceFile: join('static', '.husky', 'pre-commit'),
				markAsExecutable: true,
			},
		],
	};
};

export default plugin;
export * from '@alexaegis/lint-staged-config';
