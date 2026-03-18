import { describe, expect, it, vi, type MockInstance } from 'vitest';
import type { CollectIgnoreEntriesOptions } from './collect-ignore-entries.function.options.js';
import {
	GITIGNORE_FILENAME,
	normalizeCollectIgnoreEntriesOptions,
} from './collect-ignore-entries.function.options.js';

export const mockProcessCwdValue = '/foo';

export const mockProcessCwd = (): MockInstance<() => string> => {
	return vi.spyOn(process, 'cwd').mockReturnValue(mockProcessCwdValue);
};

describe('normalizeCollectIgnoreEntriesOptions', () => {
	it('should default Infinity when not defined', () => {
		expect(normalizeCollectIgnoreEntriesOptions()).toEqual({
			depth: Number.POSITIVE_INFINITY,
			cwd: process.cwd(),
			maxPackages: 2,
			maxResults: Number.POSITIVE_INFINITY,
			ignoreFileName: GITIGNORE_FILENAME,
		} as CollectIgnoreEntriesOptions);
	});

	it('should keep the overrides', () => {
		const depthOverride = 2;
		const maxPackagesOverride = 1;
		const ignoreFileNameOverride = '.prettierignore';
		expect(
			normalizeCollectIgnoreEntriesOptions({
				depth: depthOverride,
				maxPackages: maxPackagesOverride,
				ignoreFileName: ignoreFileNameOverride,
			}),
		).toEqual({
			depth: depthOverride,
			cwd: process.cwd(),
			maxPackages: maxPackagesOverride,
			maxResults: Number.POSITIVE_INFINITY,
			ignoreFileName: ignoreFileNameOverride,
		} as CollectIgnoreEntriesOptions);
	});
});
