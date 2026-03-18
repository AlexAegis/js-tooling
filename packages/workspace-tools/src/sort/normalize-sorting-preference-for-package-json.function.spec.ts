import type { DetailedObjectKeyOrder, ObjectKeyOrder } from '@alexaegis/common';
import { describe, expect, it } from 'vitest';
import { normalizeSortingPreferenceForPackageJson } from './normalize-sorting-preference-for-package-json.function.js';

describe('normalizeSortingPreferenceForPackageJson', () => {
	it('should add it even to empty sorting preferences', () => {
		const sortingPreference: ObjectKeyOrder = [];
		const expectedSortingPreference: ObjectKeyOrder = [
			{ key: 'exports', order: [{ key: '.*', order: ['types', '.*', 'default'] }] },
		];
		const result = normalizeSortingPreferenceForPackageJson(sortingPreference);
		expect(result).toEqual(expectedSortingPreference);
	});

	it('should override existing preferences if it is non-comforming', () => {
		const sortingPreference: ObjectKeyOrder = ['exports'];
		const expectedSortingPreference: ObjectKeyOrder = [
			{
				key: 'exports',
				order: [{ key: '.*', order: ['types', '.*', 'default'] }],
			},
		];
		const result = normalizeSortingPreferenceForPackageJson(sortingPreference);
		expect(result).toEqual(expectedSortingPreference);
	});

	it('should override existing preferences if it is non-comforming at exports level', () => {
		const sortingPreference: ObjectKeyOrder = [
			{ key: 'dependencies', order: ['a', 'b'] },
			{ key: 'exports', order: ['something'] },
		];
		const expectedSortingPreference: ObjectKeyOrder = [
			{ key: 'dependencies', order: ['a', 'b'] },
			{
				key: 'exports',
				order: [
					{ key: 'something', order: ['types', '.*', 'default'] },
					{ key: '.*', order: ['types', '.*', 'default'] },
				],
			},
		];
		const result = normalizeSortingPreferenceForPackageJson(sortingPreference);
		expect(result).toEqual(expectedSortingPreference);
	});

	it('should override existing preferences if it is non-comforming at the last level because types is not present at all', () => {
		const sortingPreference: ObjectKeyOrder = [
			{ key: 'exports', order: [{ key: '.*', order: ['nope'] }] },
		];
		const expectedSortingPreference: ObjectKeyOrder = [
			{ key: 'exports', order: [{ key: '.*', order: ['types', 'nope', '.*', 'default'] }] },
		];
		const result = normalizeSortingPreferenceForPackageJson(sortingPreference);
		expect(result).toEqual(expectedSortingPreference);
	});

	it('should add a wildcard to the exports level if there is none', () => {
		const sortingPreference: ObjectKeyOrder = [
			{
				key: 'exports',
				order: [
					{ key: 'foo', order: ['nope'] },
					{ key: 'bar', order: ['nope'] },
				],
			},
		];
		const expectedSortingPreference: ObjectKeyOrder = [
			{
				key: 'exports',
				order: [
					{ key: 'foo', order: ['types', 'nope', '.*', 'default'] },
					{ key: 'bar', order: ['types', 'nope', '.*', 'default'] },
					{ key: '.*', order: ['types', '.*', 'default'] },
				],
			},
		];
		const result = normalizeSortingPreferenceForPackageJson(sortingPreference);
		expect(result).toEqual(expectedSortingPreference);
	});

	it('should reuse custom sorters for the special keys too', () => {
		const uniqueTypesOrder: DetailedObjectKeyOrder = {
			key: 'types',
			order: [],
		};

		const uniqueCustomOrder: DetailedObjectKeyOrder = {
			key: 'nope',
			order: [],
		};

		const sortingPreference: ObjectKeyOrder = [
			{
				key: 'exports',
				order: [{ key: 'foo', order: [uniqueCustomOrder, uniqueTypesOrder] }],
			},
		];
		const expectedSortingPreference: ObjectKeyOrder = [
			{
				key: 'exports',
				order: [
					{ key: 'foo', order: [uniqueTypesOrder, uniqueCustomOrder, '.*', 'default'] },
					{ key: '.*', order: ['types', '.*', 'default'] },
				],
			},
		];
		const result = normalizeSortingPreferenceForPackageJson(sortingPreference);
		expect(result).toEqual(expectedSortingPreference);
	});

	it('should override existing preferences if it is non-comforming at the last level because types is at the wrong place', () => {
		const sortingPreference: ObjectKeyOrder = [
			{ key: 'exports', order: [{ key: '.*', order: ['nope', 'types'] }] },
		];
		const expectedSortingPreference: ObjectKeyOrder = [
			{ key: 'exports', order: [{ key: '.*', order: ['types', 'nope', '.*', 'default'] }] },
		];
		const result = normalizeSortingPreferenceForPackageJson(sortingPreference);
		expect(result).toEqual(expectedSortingPreference);
	});

	it('should override existing preferences if it is non-comforming at the last level and types is specified as an object', () => {
		const sortingPreference: ObjectKeyOrder = [
			{
				key: 'exports',
				order: [{ key: '.*', order: ['nope', { key: 'types', order: [] }] }],
			},
		];
		const expectedSortingPreference: ObjectKeyOrder = [
			{
				key: 'exports',
				order: [
					{ key: '.*', order: [{ key: 'types', order: [] }, 'nope', '.*', 'default'] },
				],
			},
		];
		const result = normalizeSortingPreferenceForPackageJson(sortingPreference);
		expect(result).toEqual(expectedSortingPreference);
	});
});
