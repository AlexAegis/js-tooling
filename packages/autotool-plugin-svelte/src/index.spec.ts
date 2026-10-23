import { createMockLogger } from '@alexaegis/logging/mocks';
import type {
	AutotoolPluginFactory,
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

	const { logger } = createMockLogger<NormalizedAutotoolPluginOptions['logger']>(vi);

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

	it('should remove svelte.config.js from sveltekit apps instead of copying one', () => {
		const svelteConfigExecutors = (library.svelteKitAppSetupPlugin.elements ?? [])
			.filter(
				(element) => 'targetFile' in element && element.targetFile === 'svelte.config.js',
			)
			.map((element) => element.executor);

		expect(svelteConfigExecutors).toEqual(['fileRemove']);
	});
});
