import { createMockLogger } from '@alexaegis/logging/mocks';
import type {
	AutotoolPluginFactory,
	AutotoolPluginObject,
	NormalizedAutotoolPluginOptions,
	PackageManager,
	WorkspacePackage,
} from 'autotool-plugin';
import { describe, expect, it, vi } from 'vitest';
import * as library from './index.js';

describe('autotool-plugin-svelte', () => {
	const rootWorkspacePackage: WorkspacePackage = {
		workspacePackagePatterns: [],
		packageJson: {},
		packageJsonPath: '/project/package.json',
		packageKind: 'root',
		packagePath: '/project',
		packagePathFromRootPackage: '.',
	};

	const { logger } = createMockLogger(vi);

	const packageManager: PackageManager = {
		installCommand: 'pnpm i',
		name: 'pnpm',
	};

	const defaultOptions: NormalizedAutotoolPluginOptions = {
		cwd: '/projects/foo',
		dry: true,
		force: false,
		logger,
		rootWorkspacePackage,
		allWorkspacePackages: [rootWorkspacePackage],
		packageManager,
	};

	it('should be defined', () => {
		expect(library).toBeDefined();
	});

	it('should define a plugin by default', async () => {
		expect(library.default).toBeDefined();

		const plugin = await (library.default as AutotoolPluginFactory)(defaultOptions);

		expect(plugin).toBeDefined();
	});

	it('should add the root lint:svelte script to every workspace, also one without svelte packages', async () => {
		const pluginObjects = (await (library.plugin as AutotoolPluginFactory)(
			defaultOptions,
		)) as AutotoolPluginObject[];
		const rootScriptElements = pluginObjects.flatMap((pluginObject) =>
			(
				(pluginObject.elements ?? []) as unknown as {
					packageKind?: string;
					packageJsonFilter?: unknown;
					data?: { scripts?: Record<string, string> };
				}[]
			)
				.filter(
					(element) =>
						element.packageKind === 'root' &&
						element.data?.scripts?.['lint:svelte'] !== undefined,
				)
				.map((element) => ({
					pluginKind: pluginObject.packageKind ?? 'all',
					pluginFilter: pluginObject.packageJsonFilter,
					elementFilter: element.packageJsonFilter,
				})),
		);

		expect(rootScriptElements).toEqual([
			{ pluginKind: 'all', pluginFilter: undefined, elementFilter: undefined },
		]);
	});

	it('should remove svelte.config.js from sveltekit apps instead of copying one', () => {
		const svelteConfigExecutors = (library.svelteKitAppSetupPlugin.elements ?? [])
			.filter(
				(element) => 'targetFile' in element && element.targetFile === 'svelte.config.js',
			)
			.map((element) => element.executor);

		expect(svelteConfigExecutors).toEqual(['fileRemove']);
	});
});
