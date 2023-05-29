import { type AutotoolPlugin, type AutotoolPluginObject } from 'autotool-plugin';
import { join } from 'node:path';
import packageJson from '../package.json';

export const plugin: AutotoolPlugin = (_options): AutotoolPluginObject => {
	return {
		name: packageJson.name,
		elements: [
			{
				description: 'package vite config file for libraries',
				executor: 'fileCopy',
				packageJsonFilter: {
					archetype: {
						kind: 'lib',
						framework: /^(?!svelte).*$/, // Svelte has its own special vite config
					},
				},
				packageKind: 'regular',
				formatWithPrettier: true,
				sourceFile: join('static', 'vite-lib.config.ts'),
				targetFile: 'vite.config.ts',
				sourcePluginPackageName: packageJson.name,
			},
			{
				description: 'package vite config file for svelte libraries',
				executor: 'fileCopy',
				packageJsonFilter: {
					archetype: {
						kind: 'lib',
						framework: 'svelte',
					},
				},
				packageKind: 'regular',
				formatWithPrettier: true,
				sourceFile: join('static', 'vite-svelte-lib.config.ts'),
				targetFile: 'vite.config.ts',
				sourcePluginPackageName: packageJson.name,
			},
			{
				description: 'package vite config file for svelte applications',
				executor: 'fileCopy',
				packageJsonFilter: {
					archetype: {
						kind: 'app',
						framework: 'svelte',
					},
				},
				packageKind: 'regular',
				formatWithPrettier: true,
				sourceFile: join('static', 'vite-svelte-app.config.ts'),
				targetFile: 'vite.config.ts',
				sourcePluginPackageName: packageJson.name,
			},

			{
				description: 'workspace build scripts',
				executor: 'packageJson',
				packageKind: 'root',
				data: {
					scripts: {
						build: 'turbo run build-lib_ build-app_ --concurrency 16 --cache-dir .cache/turbo',
						'build-lib':
							'turbo run build-lib_ --concurrency 16 --cache-dir .cache/turbo',
						'build-app':
							'turbo run build-app_ --concurrency 16 --cache-dir .cache/turbo',
					},
				},
			},
			{
				description: 'package devDependencies',
				executor: 'packageJson',
				packageKind: 'regular',
				packageJsonFilter: {
					name: /^(?!@alexaegis\/vite).*$/, // Don't add it for itself, `vite` itself is a regular dependency of it anyway
					archetype: {
						kind: /^(app|lib)$/,
					},
				},
				data: {
					devDependencies: {
						['@alexaegis/vite']: packageJson.devDependencies['@alexaegis/vite'],
						vite: packageJson.dependencies.vite,
					},
				},
			},
			{
				description: 'package build scripts for libraries',
				executor: 'packageJson',
				packageKind: 'regular',
				packageJsonFilter: {
					archetype: {
						kind: 'lib',
						framework: '', // TODO: not angular (ng-packagr) and not svelte (svelte package) -> unless vite can handle through plugins
					},
				},
				data: {
					scripts: {
						build: 'turbo run build-lib_ --concurrency 16 --cache-dir .cache/turbo --filter ${packageName}',
						'build-lib_': 'vite build',
					},
				},
			},
			{
				description: 'package build scripts for apps and additional devDependencies',
				executor: 'packageJson',
				packageKind: 'regular',
				packageJsonFilter: {
					archetype: {
						kind: 'app',
					},
				},
				data: {
					scripts: {
						build: 'turbo run build-app_ --concurrency 16 --cache-dir .cache/turbo --filter ${packageName}',
						'build-app_': 'vite build',
						dev: 'concurrently npm:watch-deps npm:start',
						'watch-deps':
							"TARGET_ENV='local' nodemon --config ${relativePathFromPackageToRoot}/node_modules/@alexaegis/autotool-plugin-vite/static/nodemon.json --watch ./node_modules/**/src/**/* --ext ts,tsx,mts,cts,svelte,js,jsx,mjs,cjs,json --ignore dist --exec 'turbo run build-lib_ --concurrency 16 --cache-dir .cache/turbo --filter ${packageName}'",
						start: "TARGET_ENV='local' vite",
					},
					devDependencies: {
						nodemon: packageJson.dependencies.nodemon,
						concurrently: packageJson.dependencies.concurrently,
					},
				},
			},
		],
	};
};

export default plugin;
