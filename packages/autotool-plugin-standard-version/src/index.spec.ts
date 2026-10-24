import { createMockLogger } from '@alexaegis/logging/mocks';
import type {
	AutotoolPluginFactory,
	NormalizedAutotoolPluginOptions,
	PackageManager,
	WorkspacePackage,
} from 'autotool-plugin';
import { describe, expect, it, vi } from 'vitest';
import * as library from './index.js';

describe('autotool-plugin-standard-version', () => {
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
});
