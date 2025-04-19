import { createMockLogger } from '@alexaegis/logging/mocks';
import type { WorkspacePackage } from '@alexaegis/workspace-tools';
import { describe, expect, it, vi } from 'vitest';
import type { NormalizedPakkContext } from '../../index.js';
import { AutoExport } from './auto-export.class.js';
import { createDefaultViteFileNameFn } from './helpers/bundle-file-name.function.js';

// TODO: Make a reusable fixture out of this

export const { logger, mockLogger } = createMockLogger(vi);

const rootWorkspacePackage: WorkspacePackage = {
	packageKind: 'root',
	packageJson: {},
	packagePath: '/foo',
	packageJsonPath: '/foo/package.json',
	packagePathFromRootPackage: '.',
	workspacePackagePatterns: ['packages/*'],
};

const workspacePackage: WorkspacePackage = {
	packageKind: 'regular',
	packageJson: {},
	packagePath: '/foo/projects/a',
	packageJsonPath: '/foo/projects/a/package.json',
	packagePathFromRootPackage: 'packages/a',
};

export const mockAutolibContext: NormalizedPakkContext = {
	formats: ['es', 'cjs'],
	packageType: 'module',
	primaryFormat: 'es',
	rootWorkspacePackage,
	workspacePackage,
	allWorkspacePackages: [rootWorkspacePackage, workspacePackage],
	fileName: createDefaultViteFileNameFn('module'),
	outDir: 'dist',
	srcDir: 'src',
	cwd: '/foo',
	logger,
};

vi.spyOn(process, 'cwd').mockReturnValue('/foo');

describe('autoExport', () => {
	describe('detecting exports', () => {
		it('should be able to examine the package and collect exportable files', async () => {
			const autoExport = new AutoExport(mockAutolibContext);

			const collectedExports = await autoExport.examinePackage(
				mockAutolibContext.workspacePackage.packageJson,
			);

			expect(collectedExports).toBeDefined();
		});
	});
});
