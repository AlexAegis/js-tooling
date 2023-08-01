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
						format: 'turbo run format_ --concurrency 16 --cache-dir .cache/turbo --filter ${packageName}',
						format_: 'prettier --cache-location .cache/prettier --write .',
						'lint:format_': 'prettier --cache-location .cache/prettier --check .',
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
						format: 'turbo run format_ --concurrency 16 --cache-dir .cache/turbo',
						format_:
							'prettier --cache-location .cache/prettier --ignore-path .config/workspace-only.prettierignore --write .',
						'lint:format_':
							'prettier --cache-location .cache/prettier --ignore-path .config/workspace-only.prettierignore --check .', // Only check files not under a package
						'lint:format':
							'turbo run lint:format_ --concurrency 16 --cache-dir .cache/turbo',
					},
					devDependencies: {
						prettier: packageJson.dependencies.prettier,
						// The plugins are no longer set as strings, time to remove them
						'prettier-plugin-svelte': undefined,
						'prettier-plugin-tailwindcss': undefined,
					},
				},
			},
			{
				description: 'copy workspace prettier ignore file used by scripts',
				executor: 'fileCopy',
				packageKind: 'root',
				sourcePluginPackageName: packageJson.name,
				sourceFile: join('static', 'workspace-only.prettierignore'),
				targetFile: join('.config', 'workspace-only.prettierignore'),
			},
			{
				description: 'copy workspace prettier config',
				executor: 'fileCopy',
				packageKind: 'root',
				formatWithPrettier: true,
				targetFile: '.prettierrc.js',
				sourcePluginPackageName: packageJson.name,
				sourceFile: join('static', 'prettierrc.js.txt'),
			},
			{
				description: 'remove old cjs prettierrc files',
				executor: 'fileRemove',
				targetFile: '.prettierrc.cjs',
			},
			{
				description: 'remove package config overrides as they arent supported',
				executor: 'fileRemove',
				packageKind: 'regular',
				targetFile: '.prettierrc.js',
			},
			{
				description: 'copy workspace prettierignore used by the editor',
				executor: 'fileCopy',
				packageKind: 'root',
				targetFile: '.prettierignore',
				sourcePluginPackageName: packageJson.name,
				sourceFile: join('static', 'workspace.prettierignore'),
			},
			{
				description: 'copy package prettierignore',
				executor: 'fileCopy', // TODO: change this to 'fileRemove' once this is resolved https://github.com/prettier/prettier/issues/4081
				packageKind: 'regular',
				targetFile: '.prettierignore',
				sourcePluginPackageName: packageJson.name,
				sourceFile: join('static', 'workspace.prettierignore'),
			},
		],
	};
};

export default plugin;
