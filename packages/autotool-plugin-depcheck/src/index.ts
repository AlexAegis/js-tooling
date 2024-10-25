import packageJson from '@alexaegis/autotool-plugin-depcheck/package.json' assert { type: 'json' };
import { contains, not } from '@alexaegis/predicate';
import { type AutotoolPlugin, type AutotoolPluginObject } from 'autotool-plugin';
import { join } from 'node:path';

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
						'lint:depcheck': 'turbo run lint:depcheck_ --concurrency 16',
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
						framework: not(contains('svelte')), // There's no svelte parser for depcheck so it would have a bunch of false reports
					},
				},
				data: {
					scripts: {
						'lint:depcheck':
							'turbo run lint:depcheck_ --concurrency 16 --filter ${packageName}',
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
