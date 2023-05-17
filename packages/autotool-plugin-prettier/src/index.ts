import { type AutotoolPlugin, type AutotoolPluginObject } from 'autotool-plugin';
import { join } from 'node:path';
import packageJson from '../package.json';

export const plugin: AutotoolPlugin = (_options): AutotoolPluginObject => {
	return {
		name: packageJson.name,
		elements: [
			{
				// ? This and the like could be split into two elements, one for turbo scripts, filtered to workspaces where turbo is used, but right now it's always used so whatever
				description: 'add package formatting scripts',
				executor: 'packageJson',
				packageKind: 'regular',
				data: {
					scripts: {
						format: 'prettier --write .',
						'lint:format_': 'prettier --check .',
						'lint:format':
							'turbo run lint:format_ --concurrency 16 --cache-dir .cache/turbo --filter ${packageName}',
					},
				},
			},
			{
				description:
					'add formatting scripts and prettier as a devDependency to the workspace',
				executor: 'packageJson',
				packageKind: 'root',
				data: {
					scripts: {
						format: 'prettier --write .', // Not done through turbo, it covers the entire repo anyway
						'lint:format_': 'prettier --check *.*',
						'lint:format':
							'turbo run lint:format_ --concurrency 16 --cache-dir .cache/turbo',
					},
					devDependencies: {
						prettier: packageJson.dependencies.prettier,
					},
				},
			},
			{
				description: 'copy workspace prettier config',
				executor: 'fileCopy',
				packageKind: 'root',
				targetFile: '.prettierrc.cjs',
				sourcePluginPackageName: packageJson.name,
				sourceFile: join('static', '.prettierrc.cjs.txt'),
			},
			{
				description: 'copy workspace prettierignore',
				executor: 'fileCopy',
				packageKind: 'root',
				targetFile: '.prettierignore',
				sourcePluginPackageName: packageJson.name,
				sourceFile: join('static', '.prettierignore'),
			},
			{
				description: 'copy package prettierignore',
				executor: 'fileCopy', // TODO: change this to 'fileRemove' once this is resolved https://github.com/prettier/prettier/issues/4081
				packageKind: 'regular',
				targetFile: '.prettierignore',
				sourcePluginPackageName: packageJson.name,
				sourceFile: join('static', '.prettierignore'),
			},
		],
	};
};

export default plugin;
