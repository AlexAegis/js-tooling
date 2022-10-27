import type { PathLike } from 'node:fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { collectPackageJsonLocationsLinearly } from './collect-package-json-locations-linearly.function';

describe('collectPackageJsonLocationsLinearly', () => {
	const testPath = '/foo/bar/zed';
	beforeEach(() => {
		vi.mock('node:fs', async () => {
			return {
				...(await vi.importActual<typeof import('node:fs')>('node:fs')),
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
