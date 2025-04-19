import { type AutotoolPlugin, type AutotoolPluginObject } from 'autotool-plugin';
import { join } from 'node:path';
import packageJson from '../package.json' with { type: 'json' };

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
						'lint:md': 'turbo run lint:md_ --concurrency 16',
						'lint:md_':
							'remark --frail --no-stdout --silently-ignore --ignore-pattern packages --ignore-pattern libs --ignore-pattern apps .', // ? I would've like to use a .config/workspace-only.remarkignore file but remark didn't use it when passed with --ignore-path, maybe a bug?
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
						'lint:md': 'turbo run lint:md_ --concurrency 16 --filter ${packageName}',
						'lint:md_': 'remark --frail --no-stdout --silently-ignore .',
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
				formatWithPrettier: true,
				sourceFile: join('static', 'dot-remarkrc.js'),
				targetFile: '.remarkrc.js',
				sourcePluginPackageName: packageJson.name,
			},
		],
	};
};

export default plugin;
