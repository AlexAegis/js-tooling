import { contains } from '@alexaegis/predicate';
import { type AutotoolPlugin, type AutotoolPluginObject } from 'autotool-plugin';
import { join } from 'node:path';
import packageJson from '../package.json' with { type: 'json' };

/**
 * For any kind of svelte package regardless of being a library, an app, using kit or not
 */
export const svelteCommonSetupPlugin: AutotoolPluginObject = {
	name: `${packageJson.name}-common`,
	packageJsonFilter: {
		archetype: {
			framework: /^svelte.*$/,
		},
	},
	elements: [
		{
			description: 'workspace svelte-check scripts and devDependencies',
			executor: 'packageJson',
			packageKind: 'root',
			data: {
				scripts: {
					'lint:svelte': 'turbo run lint:svelte_ --concurrency 16',
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
						'turbo run lint:svelte_ --concurrency 16 --filter ${packageName}',
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
					'@alexaegis/svelte-config': `^${packageJson.version}`, // versioned together
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
			framework: /^svelte$/,
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
			description: 'svelte config dependencies',
			executor: 'packageJson',
			packageKind: 'regular',
			data: {
				devDependencies: {
					'svelte-preprocess': packageJson.devDependencies['svelte-preprocess'],
				},
			},
		},

		{
			description: 'copy tsconfig for svelte (non-kit) packages',
			executor: 'fileCopy',
			packageKind: 'regular',
			formatWithPrettier: true,
			targetFile: 'tsconfig.json',
			sourcePluginPackageName: packageJson.name,
			sourceFile: join('static', 'package-svelte-tsconfig.json'),
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
			framework: /^svelte.*$/,
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
		{
			description: 'add @sveltejs/vite-plugin-svelte',
			executor: 'packageJson',
			packageKind: 'regular',
			data: {
				devDependencies: {
					'@sveltejs/vite-plugin-svelte':
						packageJson.devDependencies['@sveltejs/vite-plugin-svelte'],
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
			framework: /^sveltekit$/,
		},
	},
	elements: [
		{
			description: 'sveltekit sync on local postinstall',
			executor: 'packageJson',
			packageKind: 'regular',
			data: {
				scripts: {
					'kit:sync': 'svelte-kit sync',
					// While the pakk directive makes no sense for apps, it does for libs. It doesn't hurt to have it for both though.
					postinstall: 'svelte-kit sync # pakk:not-distributed', // This will make sure you get the autogenerated tsconfig file immediately
				},
			},
		},
		{
			description: 'copy tsconfig for sveltekit packages',
			executor: 'fileCopy',
			packageKind: 'regular',
			formatWithPrettier: true,
			targetFile: 'tsconfig.json',
			sourcePluginPackageName: packageJson.name,
			sourceFile: join('static', 'package-sveltekit-tsconfig.json'),
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
			framework: /^sveltekit$/,
			kind: 'app',
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
			description: 'package svelte.config.js file for kit',
			executor: 'fileCopy',
			packageKind: 'regular',
			formatWithPrettier: true,
			sourceFile: join('static', 'sveltekit.config.txt'),
			targetFile: 'svelte.config.js',
			sourcePluginPackageName: packageJson.name,
		},
		{
			description: 'sveltekit adapters',
			executor: 'packageJson',
			packageKind: 'regular',
			data: {
				devDependencies: {
					'@sveltejs/adapter-auto': packageJson.devDependencies['@sveltejs/adapter-auto'],
					'@sveltejs/adapter-node': packageJson.devDependencies['@sveltejs/adapter-node'],
					'@sveltejs/adapter-static':
						packageJson.devDependencies['@sveltejs/adapter-static'],
					'@sveltejs/adapter-vercel':
						packageJson.devDependencies['@sveltejs/adapter-vercel'], // let's just assume it's needed.
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
	],
};

/**
 * For non-kit svelte applications (simple SPA apps)
 */
export const svelteNonKitAppSetupPlugin: AutotoolPluginObject = {
	name: `${packageJson.name}-app`,
	packageJsonFilter: {
		archetype: {
			framework: /^svelte$/,
			kind: 'app',
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
		{
			description: 'package svelte.config.js for non kit apps',
			executor: 'fileCopy',
			packageKind: 'regular',
			formatWithPrettier: true,
			sourceFile: join('static', 'svelte.config.txt'),
			targetFile: 'svelte.config.js',
			sourcePluginPackageName: packageJson.name,
		},
	],
};

export const svelteLibarySetupPlugin: AutotoolPluginObject = {
	name: `${packageJson.name}-lib`,
	packageJsonFilter: {
		archetype: {
			framework: /^svelte.*$/,
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
					['@alexaegis/vite']: undefined,
					vite: undefined,
				},
			},
		},
		{
			description: 'remove unnecessary vite config',
			executor: 'fileRemove',
			packageKind: 'regular',
			targetFile: 'vite.config.ts',
		},
		{
			description: 'package svelte.config.js for libs',
			executor: 'fileCopy',
			packageKind: 'regular',
			formatWithPrettier: true,
			sourceFile: join('static', 'sveltelib.config.txt'),
			targetFile: 'svelte.config.js',
			sourcePluginPackageName: packageJson.name,
		},
	],
};

export const plugin: AutotoolPlugin = (_options) => {
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
