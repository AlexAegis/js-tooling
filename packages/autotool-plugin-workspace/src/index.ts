import { type AutotoolPlugin, type AutotoolPluginObject } from 'autotool-plugin';
import { join } from 'node:path';
import rootPackageJson from '../../../package.json';
import packageJson from '../package.json';

export const plugin: AutotoolPlugin = (_options): AutotoolPluginObject => {
	return {
		name: packageJson.name,
		elements: [
			{
				description: 'pnpm workspace preferences',
				executor: 'fileCopy',
				packageKind: 'root',
				sourcePluginPackageName: packageJson.name,
				sourceFile: join('static', 'pnpm-workspace.yaml'),
				targetFile: 'pnpm-workspace.yaml',
			},
			{
				description: 'package.json sort preferences',
				executor: 'fileCopy',
				packageKind: 'root',
				sourcePluginPackageName: packageJson.name,
				sourceFile: join('static', 'package.sort.json'),
				targetFile: join('.config', 'package.sort.json'),
			},
			{
				description: 'workspace engine preferences for node',
				executor: 'packageJson',
				packageKind: 'root',
				data: {
					config: {
						'engine-strict': true,
					},
					engines: {
						node: '>=20.12.0',
						npm: undefined,
						pnpm: '>=9.1.1',
					},
					packageManager: rootPackageJson.packageManager,
					workspaces: ['apps/*', 'examples/*', 'fixtures/*', 'libs/*', 'packages/*'], // Some tools like typedoc will only read this field even though the same information is defined in pnpm-workspace.yaml
				},
			},
			{
				description: 'workspace scripts and all autotool plugins as devDependencies',
				executor: 'packageJson',
				packageKind: 'root',
				data: {
					scripts: {
						nuke: 'nuke',
					},
					devDependencies: {
						'@alexaegis/nuke': packageJson.devDependencies['@alexaegis/nuke'],
						'@alexaegis/autotool-plugin-commitlint': `^${packageJson.version}`, // versioned together
						'@alexaegis/autotool-plugin-depcheck': `^${packageJson.version}`, // versioned together
						'@alexaegis/autotool-plugin-editorconfig': `^${packageJson.version}`, // versioned together
						'@alexaegis/autotool-plugin-eslint': `^${packageJson.version}`, // versioned together
						'@alexaegis/autotool-plugin-git': `^${packageJson.version}`, // versioned together
						'@alexaegis/autotool-plugin-github': `^${packageJson.version}`, // versioned together
						'@alexaegis/autotool-plugin-husky': `^${packageJson.version}`, // versioned together
						'@alexaegis/autotool-plugin-ncu': `^${packageJson.version}`, // versioned together
						'@alexaegis/autotool-plugin-prettier': `^${packageJson.version}`, // versioned together
						'@alexaegis/autotool-plugin-publint': `^${packageJson.version}`, // versioned together
						'@alexaegis/autotool-plugin-remark': `^${packageJson.version}`, // versioned together
						'@alexaegis/autotool-plugin-standard-version': `^${packageJson.version}`, // versioned together
						'@alexaegis/autotool-plugin-stylelint': `^${packageJson.version}`, // versioned together
						'@alexaegis/autotool-plugin-svelte': `^${packageJson.version}`, // versioned together
						'@alexaegis/autotool-plugin-ts': `^${packageJson.version}`, // versioned together
						'@alexaegis/autotool-plugin-turbo': `^${packageJson.version}`, // versioned together
						'@alexaegis/autotool-plugin-typedoc': `^${packageJson.version}`, // versioned together
						'@alexaegis/autotool-plugin-vite': `^${packageJson.version}`, // versioned together
						'@alexaegis/autotool-plugin-vitepress': `^${packageJson.version}`, // versioned together
						'@alexaegis/autotool-plugin-vitest': `^${packageJson.version}`, // versioned together
						'@alexaegis/autotool-plugin-vscode': `^${packageJson.version}`, // versioned together
						'@alexaegis/autotool-plugin-workspace': `^${packageJson.version}`, // versioned together
					},
				},
			},
			{
				description: 'use esm',
				executor: 'packageJson',
				data: {
					type: 'module',
				},
			},
		],
	};
};

export default plugin;
