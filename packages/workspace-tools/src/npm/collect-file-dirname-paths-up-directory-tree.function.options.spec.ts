import { describe, expect, it, vi, type MockInstance } from 'vitest';
import {
	normalizeCollectFileDirnamesUpDirectoryTreeOptions,
	type NormalizedCollectFileDirnamesUpDirectoryTreeOptions,
} from './collect-file-dirname-paths-up-directory-tree.function.options.js';

export const mockProcessCwdValue = '/foo';

export const mockProcessCwd = (): MockInstance<() => string> => {
	return vi.spyOn(process, 'cwd').mockReturnValue(mockProcessCwdValue);
};

describe('normalizeDepthOption', () => {
	it('should default Infinity when not defined', () => {
		expect(normalizeCollectFileDirnamesUpDirectoryTreeOptions()).toEqual({
			depth: Number.POSITIVE_INFINITY,
			cwd: process.cwd(),
			maxPackages: 2,
			maxResults: Number.POSITIVE_INFINITY,
		} as NormalizedCollectFileDirnamesUpDirectoryTreeOptions);
	});

	it('should keep the overrides', () => {
		const depthOverride = 2;
		const maxPackagesOverride = 1;

		expect(
			normalizeCollectFileDirnamesUpDirectoryTreeOptions({
				depth: depthOverride,
				maxPackages: maxPackagesOverride,
			}),
		).toEqual({
			depth: depthOverride,
			cwd: process.cwd(),
			maxPackages: maxPackagesOverride,
			maxResults: Number.POSITIVE_INFINITY,
		} as NormalizedCollectFileDirnamesUpDirectoryTreeOptions);
	});
});
