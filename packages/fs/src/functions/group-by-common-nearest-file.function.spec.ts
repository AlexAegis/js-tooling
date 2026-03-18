import { join } from 'node:path/posix';
import { describe, expect, it, vi } from 'vitest';
import { groupByCommonNearestFile } from './group-by-common-nearest-file.function.js';

vi.mock('node:fs', () => {
	return {
		existsSync: vi.fn((path: string) =>
			[
				join('/foo'),
				join('/foo', 'zed', 'package.json'),
				join('/foo', 'bar', 'package.json'),
			].includes(path),
		),
	};
});

describe('groupByCommonNearestFile', () => {
	it('should group groupable paths', () => {
		const zedPaths = [join('/foo', 'zed', 'a'), join('/foo', 'zed', 'b')];

		const barPaths = [
			join('/foo', 'bar', 'a'),
			join('/foo', 'bar', 'b', 'o'),
			join('/foo', 'bar', 'c'),
		];

		expect(groupByCommonNearestFile([...zedPaths, ...barPaths], 'package.json')).toEqual({
			[join('/foo/zed')]: zedPaths,
			[join('/foo/bar')]: barPaths,
		});
	});

	it('should group skips paths that are not in any group', () => {
		const zedPaths = [join('/foo', 'zed', 'a'), join('/foo', 'zed', 'b')];

		const barPaths = [
			join('/foo', 'bar', 'a'),
			join('/foo', 'bar', 'b', 'o'),
			join('/foo', 'bar', 'c'),
		];

		const outsidePaths = [join('/out', 'bar', 'b', 'o'), join('/out', 'bar', 'c')];

		expect(
			groupByCommonNearestFile([...zedPaths, ...barPaths, ...outsidePaths], 'package.json'),
		).toEqual({
			[join('/foo/zed')]: zedPaths,
			[join('/foo/bar')]: barPaths,
		});
	});
});
