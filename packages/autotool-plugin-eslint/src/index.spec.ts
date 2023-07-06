import { createMockLogger } from '@alexaegis/logging/mocks';
import type {
	AutotoolPluginFactory,
	NormalizedAutotoolPluginOptions,
	WorkspacePackage,
} from 'autotool-plugin';
import { describe, expect, it, vi } from 'vitest';
import * as library from './index.js';

describe('autotool-plugin-eslint', () => {
	const rootWorkspacePackage: WorkspacePackage = {
		workspacePackagePatterns: [],
		packageJson: {},
		packageJsonPath: '/project/package.json',
		packageKind: 'root',
		packagePath: '/project',
		packagePathFromRootPackage: '.',
	};

	const { logger } = createMockLogger(vi);

	const defaultOptions: NormalizedAutotoolPluginOptions = {
		cwd: '/projects/foo',
		dry: true,
		force: false,
		logger,
		rootWorkspacePackage,
	};

	it('should be defined', () => {
		expect(library).toBeDefined();
	});

	it('should define a plugin by default', async () => {
		expect(library.default).toBeDefined();

		const plugin = await (library.default as AutotoolPluginFactory)(defaultOptions);

		expect(plugin).toBeDefined();
	});

	describe('joinAdditionalExtends', () => {
		it('should join strings like so', () => {
			expect(library.joinAdditionalExtends('foo', 'bar', 'amogus')).toEqual(
				", 'foo', 'bar', 'amogus'",
			);
		});

		it('should return an empty string for empty inputs', () => {
			expect(library.joinAdditionalExtends()).toEqual('');
		});
	});
});
