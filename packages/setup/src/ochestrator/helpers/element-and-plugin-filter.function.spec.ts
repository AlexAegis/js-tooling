import type { SetupPluginFilter } from '@alexaegis/setup-plugin';
import { PACKAGE_JSON_NAME, type WorkspacePackage } from '@alexaegis/workspace-tools';
import { describe, expect, it } from 'vitest';
import { elementAndPluginFilter } from './element-and-plugin-filter.function.js';

describe('elementAndPluginFilter', () => {
	const rootPackage: WorkspacePackage = {
		packageJson: {
			name: 'root',
		},
		packageJsonPath: 'foo/' + PACKAGE_JSON_NAME,
		packagePath: 'foo',
		packageKind: 'root',
		workspacePackagePatterns: ['packages/*'],
	};

	const regularPackageZed: WorkspacePackage = {
		packageJson: {
			name: 'zed',
			private: false,
		},
		packageJsonPath: 'foo/packages/zed' + PACKAGE_JSON_NAME,
		packagePath: 'foo/packages/zed',
		packageKind: 'regular',
	};

	const regularPackageZod: WorkspacePackage = {
		packageJson: {
			name: 'zod',
			private: true,
		},
		packageJsonPath: 'foo/packages/zod' + PACKAGE_JSON_NAME,
		packagePath: 'foo/packages/zod',
		packageKind: 'regular',
	};

	describe('packageKind filtering', () => {
		it('should be able filter out only regular packages', () => {
			const filter: SetupPluginFilter = {
				packageKind: 'regular',
			};
			expect(elementAndPluginFilter(rootPackage, filter)).toBeFalsy();
			expect(elementAndPluginFilter(regularPackageZed, filter)).toBeTruthy();
			expect(elementAndPluginFilter(regularPackageZod, filter)).toBeTruthy();
		});

		it('should be able filter out only root packages', () => {
			const filter: SetupPluginFilter = {
				packageKind: 'root',
			};
			expect(elementAndPluginFilter(rootPackage, filter)).toBeTruthy();
			expect(elementAndPluginFilter(regularPackageZed, filter)).toBeFalsy();
			expect(elementAndPluginFilter(regularPackageZod, filter)).toBeFalsy();
		});

		it('should be able keep both kinds when not defined', () => {
			const filter: SetupPluginFilter = {};
			expect(elementAndPluginFilter(rootPackage, filter)).toBeTruthy();
			expect(elementAndPluginFilter(regularPackageZed, filter)).toBeTruthy();
			expect(elementAndPluginFilter(regularPackageZod, filter)).toBeTruthy();
		});

		it('should be able keep both kinds when explicitly defined to keep both', () => {
			const filter: SetupPluginFilter = {
				packageKind: 'all',
			};
			expect(elementAndPluginFilter(rootPackage, filter)).toBeTruthy();
			expect(elementAndPluginFilter(regularPackageZed, filter)).toBeTruthy();
			expect(elementAndPluginFilter(regularPackageZod, filter)).toBeTruthy();
		});
	});

	describe('packageJson filtering', () => {
		it('should be able filter out only regular packages', () => {
			const filter: SetupPluginFilter = {
				packageJsonFilter: {
					name: (name) => name.startsWith('z'),
				},
			};
			expect(elementAndPluginFilter(rootPackage, filter)).toBeFalsy();
			expect(elementAndPluginFilter(regularPackageZed, filter)).toBeTruthy();
			expect(elementAndPluginFilter(regularPackageZod, filter)).toBeTruthy();
		});
	});

	describe('mixed filtering', () => {
		it('should be able filter using both', () => {
			const filter: SetupPluginFilter = {
				packageKind: 'regular',
				packageJsonFilter: {
					private: true,
				},
			};
			expect(elementAndPluginFilter(rootPackage, filter)).toBeFalsy();
			expect(elementAndPluginFilter(regularPackageZed, filter)).toBeFalsy();
			expect(elementAndPluginFilter(regularPackageZod, filter)).toBeTruthy();
		});
	});
});
