import { type AutotoolPlugin, type AutotoolPluginObject } from 'autotool-plugin';
import { join } from 'node:path';
import packageJson from '../package.json';

export const plugin: AutotoolPlugin = (_options): AutotoolPluginObject => {
	return {
		name: packageJson.name,
		elements: [
			{
				description: 'workspace turbo config file',
				executor: 'fileCopy',
				packageKind: 'root',
				sourceFile: join('static', 'turbo.json'),
				targetFile: 'turbo.json',
				sourcePluginPackageName: packageJson.name,
			},
			{
				description: 'workspace turbo scripts and devDependencies',
				executor: 'packageJson',
				packageKind: 'root',
				data: {
					scripts: {
						build: 'turbo run build-lib_ build-app_ --concurrency 16 --cache-dir .cache/turbo',
						'build-lib':
							'turbo run build-lib_ --concurrency 16 --cache-dir .cache/turbo',
						ce: 'turbo run ce_ --concurrency 16 --cache-dir .cache/turbo',
						lint: 'turbo run lint_ --concurrency 16 --cache-dir .cache/turbo',
					},
					devDependencies: {
						turbo: packageJson.dependencies.turbo,
					},
				},
			},
		],
	};
};

export default plugin;
