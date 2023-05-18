import {
	type AutotoolPlugin,
	type AutotoolPluginObject,
	type PackageJsonFilter,
} from 'autotool-plugin';
import { join } from 'node:path';
import packageJson from '../package.json';

export const plugin: AutotoolPlugin = (_options): AutotoolPluginObject => {
	const packageJsonFilter: PackageJsonFilter = {
		archetype: {
			framework: 'svelte',
		},
	};

	return {
		name: packageJson.name,
		elements: [
			{
				description: 'package svelte config file',
				executor: 'fileCopy',
				packageKind: 'regular',
				packageJsonFilter,
				sourceFile: join('static', 'svelte.config.txt'),
				targetFile: 'svelte.config.js',
				sourcePluginPackageName: packageJson.name,
			},

			{
				description: 'workspace scripts and devDependencies',
				executor: 'packageJson',
				packageKind: 'root',
				data: {
					scripts: {
						'lint:svelte':
							'turbo run lint:svelte_ --concurrency 16 --cache-dir .cache/turbo',
					},
					devDependencies: {
						'svelte-check': packageJson.dependencies['svelte-check'], // added to the root for lint-staged
					},
				},
			},
			{
				description: 'package svelte scripts and devDependencies',
				executor: 'packageJson',
				packageKind: 'regular',
				packageJsonFilter,
				data: {
					scripts: {
						start: "TARGET_ENV='local' vite",
						'lint:svelte':
							'turbo run lint:svelte_ --concurrency 16 --cache-dir .cache/turbo --filter ${packageName}',
						'lint:svelte_': 'svelte-check --tsconfig ./tsconfig.json',
					},
					devDependencies: {
						svelte: packageJson.dependencies.svelte,
						'svelte-check': packageJson.dependencies['svelte-check'],
						'svelte-preprocess': packageJson.dependencies['svelte-preprocess'],
						'@sveltejs/kit': packageJson.dependencies['@sveltejs/kit'],
					},
				},
			},
		],
	};
};

export default plugin;
