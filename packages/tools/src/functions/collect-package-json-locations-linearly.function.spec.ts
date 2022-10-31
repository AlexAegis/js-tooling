import type { PathLike } from 'node:fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { collectPackageJsonLocationsLinearly } from './collect-package-json-locations-linearly.function.js';

describe('collectPackageJsonLocationsLinearly', () => {
	const testPath = '/foo/bar/zed';
	beforeEach(() => {
		vi.mock('node:fs', async () => {
			// Don't use it in the case of fs, don't do actual fs calls even by accident
			// ...(await vi.importActual<typeof import('node:fs')>('node:fs')),
			return {
				existsSync: vi.fn(
					(path: PathLike) =>
						path === '/foo/bar/zed/package.json' || path === '/foo/bar/package.json'
				),
			};
		});
	});

	it('should be able to walk', () => {
		const foundPackageJsons = collectPackageJsonLocationsLinearly(testPath);
		expect(foundPackageJsons).toEqual(['/foo/bar', '/foo/bar/zed']);
	});
});
