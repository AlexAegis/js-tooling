import { type AutotoolPlugin, type AutotoolPluginObject } from 'autotool-plugin';
import { join } from 'node:path';
import packageJson from '../package.json';

export const plugin: AutotoolPlugin = (_options): AutotoolPluginObject => {
	return {
		name: packageJson.name,
		elements: [
			{
				description: 'workspace remark scripts and devDependencies',
				executor: 'packageJson',
				packageKind: 'root',
				data: {
					scripts: {
						'lint:md': 'turbo run lint:md_ --concurrency 16 --cache-dir .cache/turbo',
						'lint:md_':
							'remark --frail --no-stdout --silently-ignore *.md docs/**/*.md',
					},
					devDependencies: {
						'remark-cli': packageJson.devDependencies['remark-cli'],
						remark: packageJson.devDependencies.remark, // A local installation is required by the remark langauge server
					},
				},
			},
			{
				description: 'package remark scripts',
				executor: 'packageJson',
				packageKind: 'regular',
				data: {
					scripts: {
						'lint:md':
							'turbo run lint:md_ --concurrency 16 --cache-dir .cache/turbo --filter ${packageName}',
						'lint:md_':
							'remark --frail --no-stdout --silently-ignore *.md docs/**/*.md',
					},
				},
			},
			{
				description: 'workspace remarkignore file',
				executor: 'fileCopy',
				packageKind: 'root',
				sourceFile: join('static', 'dot-remarkignore'),
				targetFile: '.remarkignore',
				sourcePluginPackageName: packageJson.name,
			},
			{
				description: 'workspace remarkrc config file',
				executor: 'fileCopy',
				packageKind: 'root',
				sourceFile: join('static', 'dot-remarkrc.js'),
				targetFile: '.remarkrc.js',
				sourcePluginPackageName: packageJson.name,
			},
		],
	};
};

export default plugin;
