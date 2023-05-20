import { type AutotoolPlugin, type AutotoolPluginObject } from 'autotool-plugin';
import { join } from 'node:path';
import packageJson from '../package.json';

export const plugin: AutotoolPlugin = (_options): AutotoolPluginObject => {
	return {
		name: packageJson.name,
		elements: [
			{
				description: 'vscode settings',
				executor: 'fileCopy',
				packageKind: 'root',
				sourcePluginPackageName: packageJson.name,
				sourceFile: join('static', 'pnpm-workspace.yaml'),
				targetFile: 'pnpm-workspace.yaml',
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
						node: '>=18.10.0',
						npm: undefined,
						pnpm: '>=8.0.0',
					},
					packageManager: 'pnpm@8.5.1',
				},
			},
			{
				description: 'workspace scripts and all autotool plugins as devDependencies',
				executor: 'packageJson',
				packageKind: 'root',
				data: {
					scripts: {
						nuke: 'nuke',
						ncu: 'ncu --deep --peer --upgrade && pnpm up',
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
						'@alexaegis/autotool-plugin-vitest': `^${packageJson.version}`, // versioned together
						'@alexaegis/autotool-plugin-vscode': `^${packageJson.version}`, // versioned together
						'@alexaegis/autotool-plugin-workspace': `^${packageJson.version}`, // versioned together
						'npm-check-updates': packageJson.dependencies['npm-check-updates'],
					},
				},
			},
		],
	};
};

export default plugin;
