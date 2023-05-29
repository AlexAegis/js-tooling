import { type AutotoolPlugin, type AutotoolPluginObject } from 'autotool-plugin';
import { join } from 'node:path';
import packageJson from '../package.json';

const assembleAdditionalConfigs = (...configPackageNames: string[]): string => {
	return configPackageNames.map((name) => `require('${name}').default`).join(', ');
};

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
						format_:
							'prettier --no-plugin-search --cache-location .cache/prettier --write .',
						'lint:format_':
							'prettier --no-plugin-search --cache-location .cache/prettier --check .',
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
							'prettier --no-plugin-search --cache-location .cache/prettier --ignore-path .config/workspace-only.prettierignore --write .',
						'lint:format_':
							'prettier --no-plugin-search --cache-location .cache/prettier --ignore-path .config/workspace-only.prettierignore --check .', // Only check files not under a package
						'lint:format':
							'turbo run lint:format_ --concurrency 16 --cache-dir .cache/turbo',
					},
					devDependencies: {
						prettier: packageJson.dependencies.prettier,
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
				targetFile: '.prettierrc.cjs',
				sourcePluginPackageName: packageJson.name,
				sourceFile: join('static', 'prettierrc.cjs.txt'),
			},
			{
				description: 'add prettier-config-svelte as a devDependency',
				executor: 'packageJson',
				packageKind: 'regular',
				packageJsonFilter: {
					archetype: {
						framework: 'svelte',
					},
				},
				data: {
					devDependencies: {
						'@alexaegis/prettier-config':
							packageJson.dependencies['@alexaegis/prettier-config'],
						'@alexaegis/prettier-config-svelte':
							packageJson.dependencies['@alexaegis/prettier-config'], // Different package, versioned together
					},
				},
			},
			{
				description: 'add prettier-config-tailwind as a devDependency',
				executor: 'packageJson',
				packageKind: 'regular',
				packageJsonFilter: {
					devDependencies: {
						tailwindcss: /.*/,
					},
				},
				data: {
					devDependencies: {
						'@alexaegis/prettier-config':
							packageJson.dependencies['@alexaegis/prettier-config'],
						'@alexaegis/prettier-config-tailwind':
							packageJson.dependencies['@alexaegis/prettier-config'], // Different package, versioned together
					},
				},
			},
			{
				description: 'copy svelte prettier config without tailwind',
				executor: 'fileCopy',
				packageKind: 'regular',
				packageJsonFilter: {
					archetype: {
						framework: 'svelte',
					},
					devDependencies: {
						tailwindcss: undefined,
					},
				},
				targetFile: '.prettierrc.cjs',
				templateVariables: {
					additionalConfigs: assembleAdditionalConfigs(
						'@alexaegis/prettier-config-svelte'
					),
				},
				sourcePluginPackageName: packageJson.name,
				sourceFile: join('static', 'prettierrc.custom.cjs.txt'),
			},
			{
				description: 'copy svelte prettier config with tailwind',
				executor: 'fileCopy',
				packageKind: 'regular',
				packageJsonFilter: {
					archetype: {
						framework: 'svelte',
					},
					devDependencies: {
						tailwindcss: /.*/,
					},
				},
				targetFile: '.prettierrc.cjs',
				templateVariables: {
					additionalConfigs: assembleAdditionalConfigs(
						'@alexaegis/prettier-config-svelte',
						'@alexaegis/prettier-config-tailwind'
					),
				},
				sourcePluginPackageName: packageJson.name,
				sourceFile: join('static', 'prettierrc.custom.cjs.txt'),
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
				sourceFile: join('static', '.prettierignore'),
			},
		],
	};
};

export default plugin;
