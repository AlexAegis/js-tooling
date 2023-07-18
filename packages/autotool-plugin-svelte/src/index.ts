import { contains } from '@alexaegis/predicate';
import { type AutotoolPlugin, type AutotoolPluginObject } from 'autotool-plugin';
import { join } from 'node:path';
import packageJson from '../package.json';

/**
 * For any kind of svelte package regardless of being a library, an app, using kit or not
 */
export const svelteCommonSetupPlugin: AutotoolPluginObject = {
	name: `${packageJson.name}-common`,
	packageJsonFilter: {
		archetype: {
			framework: 'svelte',
		},
	},
	elements: [
		{
			description: 'workspace svelte-check scripts and devDependencies',
			executor: 'packageJson',
			packageKind: 'root',
			data: {
				scripts: {
					'lint:svelte':
						'turbo run lint:svelte_ --concurrency 16 --cache-dir .cache/turbo',
				},
				devDependencies: {
					'svelte-check': packageJson.devDependencies['svelte-check'], // added to the root for lint-staged
				},
			},
		},
		{
			description: 'package svelte-check scripts and devDependencies',
			executor: 'packageJson',
			packageKind: 'regular',
			data: {
				scripts: {
					'lint:svelte':
						'turbo run lint:svelte_ --concurrency 16 --cache-dir .cache/turbo --filter ${packageName}',
					'lint:svelte_': 'svelte-check --tsconfig ./tsconfig.json',
				},
				devDependencies: {
					'svelte-check': packageJson.devDependencies['svelte-check'],
				},
			},
		},
		{
			description: 'package svelte devDependency',
			executor: 'packageJson',
			packageKind: 'regular',
			data: {
				devDependencies: {
					svelte: packageJson.devDependencies.svelte, // It's used everywhere
				},
			},
		},
	],
};

/**
 * For any svelte package that is non kit
 */
export const svelteNonKitCommonSetupPlugin: AutotoolPluginObject = {
	name: `${packageJson.name}-common`,
	packageJsonFilter: {
		archetype: {
			framework: 'svelte',
			kit: undefined,
		},
	},
	elements: [
		{
			description: 'remove kit for non sveltekit svelte packages',
			executor: 'packageJson',
			packageKind: 'regular',
			consolidationPass: 1,
			data: {
				devDependencies: {
					'@sveltejs/kit': undefined,
				},
			},
		},
		{
			description: 'remove svelte-kit sync on postinstall for non kit packages',
			executor: 'packageJson',
			packageKind: 'regular',
			consolidationPass: 1,
			packageJsonFilter: {
				scripts: {
					postinstall: contains('svelte-kit sync'),
				},
			},
			data: {
				scripts: {
					postinstall: undefined,
				},
			},
		},
		{
			description: 'package svelte.config.js for non kit packages',
			executor: 'fileCopy',
			packageKind: 'regular',
			formatWithPrettier: true,
			sourceFile: join('static', 'svelte.config.txt'),
			targetFile: 'svelte.config.js',
			sourcePluginPackageName: packageJson.name,
		},
		{
			description: 'svelte config dependencies',
			executor: 'packageJson',
			packageKind: 'regular',
			data: {
				devDependencies: {
					'svelte-preprocess': packageJson.devDependencies['svelte-preprocess'],
				},
			},
		},
	],
};

/**
 * For apps regardless of kit or not
 */
export const svelteAppCommonSetupPlugin: AutotoolPluginObject = {
	name: `${packageJson.name}-app-common`,
	packageJsonFilter: {
		archetype: {
			framework: 'svelte',
			kind: 'app',
		},
	},
	elements: [
		{
			description: 'svelte vite app start script',
			executor: 'packageJson',
			packageKind: 'regular',
			data: {
				scripts: {
					start: "TARGET_ENV='local' vite",
				},
			},
		},
	],
};

/**
 * For kit related stuff regardless of being an app or a lib
 */
export const svelteKitCommonSetupPlugin: AutotoolPluginObject = {
	name: `${packageJson.name}-kit`,
	packageJsonFilter: {
		archetype: {
			framework: 'svelte',
			kit: /^.*$/,
		},
	},
	elements: [
		{
			description: 'sveltekit sync on local postinstall',
			executor: 'packageJson',
			packageKind: 'regular',
			data: {
				scripts: {
					// TODO: this pakk feature is not implemented, revisit this placeholder once it is implemented
					// While the pakk directive makes no sense for apps, it does for libs. It doesn't hurt to have it for both though.
					postinstall: 'svelte-kit sync # pakk:no-publish', // This will make sure you get the autogenerated tsconfig file immediately
				},
			},
		},
	],
};

/**
 * For sveltekit apps
 */
export const svelteKitAppSetupPlugin: AutotoolPluginObject = {
	name: `${packageJson.name}-kit-app`,
	packageJsonFilter: {
		archetype: {
			framework: 'svelte',
			kind: 'app',
			kit: /^.*$/,
		},
	},
	elements: [
		{
			description: 'sveltekit dependencies',
			executor: 'packageJson',
			packageKind: 'regular',
			data: {
				devDependencies: {
					'@sveltejs/kit': packageJson.devDependencies['@sveltejs/kit'],
				},
			},
		},
		{
			description: 'package svelte config file (sveltekit/static)',
			executor: 'fileCopy',
			packageKind: 'regular',
			packageJsonFilter: {
				archetype: {
					kit: 'static',
				},
			},
			formatWithPrettier: true,
			sourceFile: join('static', 'sveltekit-static.config.txt'),
			targetFile: 'svelte.config.js',
			sourcePluginPackageName: packageJson.name,
		},
		{
			description: 'package svelte config file (sveltekit/auto)',
			executor: 'fileCopy',
			packageKind: 'regular',
			packageJsonFilter: {
				archetype: {
					kit: 'auto',
				},
			},
			formatWithPrettier: true,
			sourceFile: join('static', 'sveltekit.config.txt'),
			targetFile: 'svelte.config.js',
			sourcePluginPackageName: packageJson.name,
		},
		{
			description: 'sveltekit adapter static dependencies',
			executor: 'packageJson',
			packageKind: 'regular',
			packageJsonFilter: {
				archetype: {
					kit: 'static',
				},
			},
			data: {
				devDependencies: {
					'@sveltejs/adapter-auto': undefined,
					'@sveltejs/adapter-static':
						packageJson.devDependencies['@sveltejs/adapter-static'],
				},
			},
		},
		{
			description: 'sveltekit adapter auto dependencies',
			executor: 'packageJson',
			packageKind: 'regular',
			packageJsonFilter: {
				archetype: {
					kit: 'auto',
				},
			},
			data: {
				devDependencies: {
					'@sveltejs/adapter-auto': packageJson.devDependencies['@sveltejs/adapter-auto'],
					'@sveltejs/adapter-static': undefined,
				},
			},
		},
		{
			description: 'sveltekit application vite config',
			executor: 'fileCopy',
			packageKind: 'regular',
			sourceFile: join('static', 'vite-sveltekit-app.config.ts'),
			targetFile: 'vite.config.ts',
			sourcePluginPackageName: packageJson.name,
		},
		{
			description: 'remove unneeded dependencies meant for non-kit only',
			executor: 'packageJson',
			packageKind: 'regular',
			consolidationPass: 1,
			data: {
				devDependencies: {
					'@sveltejs/vite-plugin-svelte': undefined, // Kit ships its own vite plugin
				},
			},
		},
	],
};

/**
 * For non-kit svelte applications (simple SPA apps)
 */
export const svelteNonKitAppSetupPlugin: AutotoolPluginObject = {
	name: `${packageJson.name}-app`,
	packageJsonFilter: {
		archetype: {
			framework: 'svelte',
			kind: 'app',
			kit: undefined,
		},
	},
	elements: [
		{
			description: 'svelte application (non-kit) vite dependencies',
			executor: 'packageJson',
			packageKind: 'regular',
			data: {
				devDependencies: {
					'@sveltejs/vite-plugin-svelte':
						packageJson.devDependencies['@sveltejs/vite-plugin-svelte'],
				},
			},
		},
		{
			description: 'svelte application (non-kit) vite config',
			executor: 'fileCopy',
			packageKind: 'regular',
			sourceFile: join('static', 'vite-svelte-app.config.ts'),
			targetFile: 'vite.config.ts',
			sourcePluginPackageName: packageJson.name,
		},
	],
};

export const svelteLibarySetupPlugin: AutotoolPluginObject = {
	name: `${packageJson.name}-lib`,
	packageJsonFilter: {
		archetype: {
			framework: 'svelte',
			kind: 'lib',
		},
	},
	elements: [
		{
			description: 'package svelte library scripts and devDependencies',
			executor: 'packageJson',
			packageKind: 'regular',
			data: {
				scripts: {
					['build-lib_']:
						'pakk --svelte --target-package-json-kind development && svelte-package --input src && pakk --svelte --target-package-json-kind distribution',
				},
				devDependencies: {
					'@pakk/cli': packageJson.devDependencies['@pakk/cli'],
					'@sveltejs/package': packageJson.devDependencies['@sveltejs/package'],
				},
			},
		},
	],
};

export const plugin: AutotoolPlugin = (_options) => {
	console.log('lasodlas');
	return [
		svelteCommonSetupPlugin,
		svelteAppCommonSetupPlugin,
		svelteLibarySetupPlugin,
		svelteKitCommonSetupPlugin,
		svelteKitAppSetupPlugin,
		svelteNonKitCommonSetupPlugin,
		svelteNonKitAppSetupPlugin,
	];
};

export default plugin;
