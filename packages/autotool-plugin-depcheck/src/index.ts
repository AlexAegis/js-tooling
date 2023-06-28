import { equal, not } from '@alexaegis/predicate';
import { type AutotoolPlugin, type AutotoolPluginObject } from 'autotool-plugin';
import { join } from 'node:path';
import packageJson from '../package.json';

export const plugin: AutotoolPlugin = (_options): AutotoolPluginObject => {
	return {
		name: packageJson.name,
		elements: [
			{
				description: 'add depcheck scripts to workspace',
				executor: 'packageJson',
				packageKind: 'root',
				data: {
					scripts: {
						'lint:depcheck':
							'turbo run lint:depcheck_ --concurrency 16 --cache-dir .cache/turbo',
						'lint:depcheck_': 'depcheck',
					},
				},
			},
			{
				description: 'add depcheck scripts to packages',
				executor: 'packageJson',
				packageKind: 'regular',
				packageJsonFilter: {
					archetype: {
						framework: not(equal('svelte')), // There's no svelte parser for depcheck so it would have a bunch of false reports
					},
				},
				data: {
					scripts: {
						'lint:depcheck':
							'turbo run lint:depcheck_ --concurrency 16 --cache-dir .cache/turbo --filter ${packageName}',
						'lint:depcheck_': 'depcheck',
					},
				},
			},
			{
				description: 'copy workspace depcheck config',
				executor: 'fileCopy',
				packageKind: 'root',
				formatWithPrettier: true,
				targetFile: '.depcheckrc.json',
				sourcePluginPackageName: packageJson.name,
				sourceFile: join('static', 'depcheckrc.json'),
			},
			{
				description: 'add depcheck as a devDependency to the workspace',
				executor: 'packageJson',
				packageKind: 'root',
				data: {
					devDependencies: {
						depcheck: packageJson.devDependencies.depcheck,
					},
				},
			},
		],
	};
};

export default plugin;
