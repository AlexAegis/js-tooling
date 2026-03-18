import { noopLogger } from '@alexaegis/logging';
import { describe, expect, it, vi } from 'vitest';
import {
	normalizeGetRootPackageJsonOptions,
	type GetRootPackageJsonOptions,
	type NormalizedGetRootPackageJsonOptions,
} from './get-root-package-json.function.options.js';

const mockCwd = '/foo/bar';

vi.spyOn(process, 'cwd').mockReturnValue(mockCwd);

describe('normalizeGetRootPackageJsonOptions', () => {
	const defaultOptions: NormalizedGetRootPackageJsonOptions = {
		cwd: mockCwd,
		logger: noopLogger,
	};

	it('should have a default when not defined', () => {
		expect(normalizeGetRootPackageJsonOptions()).toEqual(defaultOptions);
	});

	it('should use the provided values when defined', () => {
		const manualOptions: GetRootPackageJsonOptions = {
			cwd: 'foo',
		};
		expect(normalizeGetRootPackageJsonOptions(manualOptions)).toEqual({
			...defaultOptions,
			...manualOptions,
		});
	});
});
