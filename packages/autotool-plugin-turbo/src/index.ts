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
				formatWithPrettier: true,
				targetFile: 'turbo.json',
				sourcePluginPackageName: packageJson.name,
			},
			{
				description: 'package turbo scripts and devDependencies',
				executor: 'packageJson',
				packageKind: 'regular',
				data: {
					scripts: {
						all: 'turbo run all_ --concurrency 16 --cache-dir .cache/turbo --filter ${packageName}',
					},
				},
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
						all: 'turbo run all_ --concurrency 16 --cache-dir .cache/turbo',
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
