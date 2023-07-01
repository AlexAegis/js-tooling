import { type AutotoolPlugin, type AutotoolPluginObject } from 'autotool-plugin';
import { join } from 'node:path';
import packageJson from '../package.json';

export const plugin: AutotoolPlugin = (_options): AutotoolPluginObject => {
	return {
		name: packageJson.name,
		elements: [
			{
				description: 'ncu config',
				executor: 'fileCopy',
				packageKind: 'root',
				sourcePluginPackageName: packageJson.name,
				sourceFile: join('static', 'ncurc.json'),
				targetFile: join('.config', '.ncurc.json'),
			},
			{
				description: 'workspace scripts of ncu',
				executor: 'packageJson',
				packageKind: 'root',
				data: {
					scripts: {
						// Here this variable will always be '.' but if a script like this is ever
						// moved to an inner package it will be trivial.
						ncu: 'ncu --configFilePath ${relativePathFromPackageToRoot}/.config/ && pnpm up',
					},
					devDependencies: {
						'npm-check-updates': packageJson.dependencies['npm-check-updates'],
					},
				},
			},
		],
	};
};

export default plugin;
