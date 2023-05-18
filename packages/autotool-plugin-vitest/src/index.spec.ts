import type { Logger } from '@alexaegis/logging';
import { MockLogger } from '@alexaegis/logging/mocks';
import type {
	AutotoolPluginFactory,
	NormalizedAutotoolPluginOptions,
	WorkspacePackage,
} from 'autotool-plugin';
import { describe, expect, it } from 'vitest';
import * as library from './index.js';

describe('autotool-plugin-vitest', () => {
	const rootWorkspacePackage: WorkspacePackage = {
		workspacePackagePatterns: [],
		packageJson: {},
		packageJsonPath: '/project/package.json',
		packageKind: 'root',
		packagePath: '/project',
		packagePathFromRootPackage: '.',
	};

	const mockLogger = new MockLogger();
	const logger = mockLogger as unknown as Logger<unknown>;

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
});
