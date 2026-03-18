import { afterEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_PACKAGE_JSON_SORTING_PREFERENCE } from './default-package-json-order.const.js';
import {
	createJsonSortingPreferenceNormalizer,
	type SortingPreferenceJson,
} from './normalize-json-sorting-preference.function.js';

const readJsonMock = vi.hoisted(() =>
	vi.fn((fileName: string): SortingPreferenceJson | undefined => {
		if (fileName === '/foo/.config/package.sort.json') {
			return { sort: ['name'] };
		} else if (fileName === '/foo/.config/custom.sort.json') {
			return { sort: ['custom'] };
		} else {
			return undefined;
		}
	}),
);

vi.mock('@alexaegis/fs', async () => {
	return {
		readJson: readJsonMock,
		normalizeCwdOption: () => {
			return {
				cwd: '/foo',
			};
		},
		normalizeDirectoryDepthOption: await vi
			.importActual<typeof import('@alexaegis/fs')>('@alexaegis/fs')
			.then((mod) => mod.normalizeDirectoryDepthOption),
	};
});

vi.mock('node:fs', () => {
	return {
		readJson: readJsonMock,
		existsSync: (path: string) => {
			return path === '/foo/package.json';
		},
	};
});

describe('normalize-json-sorting-preference', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should return an empty order when there is no sort.json file and it is not a package.json order', async () => {
		const normalizer = await createJsonSortingPreferenceNormalizer('nothinginparticular.json');
		expect(readJsonMock).toHaveBeenCalledTimes(1);
		expect(typeof normalizer).toEqual('function');
		const order = normalizer();
		expect(order).toBeDefined();
		expect(order).toEqual([]);
	});

	it('should return the order defined in the sort.json file when possible', async () => {
		const normalizer = await createJsonSortingPreferenceNormalizer('custom.json');
		expect(readJsonMock).toHaveBeenCalledTimes(1);
		expect(typeof normalizer).toEqual('function');
		const order = normalizer();
		expect(order).toBeDefined();
		expect(order).toEqual(['custom']);
	});

	it('should adjust the package.json order when reading from package.sort.json', async () => {
		const normalizer = await createJsonSortingPreferenceNormalizer('package.json');
		expect(readJsonMock).toHaveBeenCalledTimes(1);
		expect(typeof normalizer).toEqual('function');
		const order = normalizer();
		expect(order).toBeDefined();
		expect(order).toEqual([
			'name',
			{
				key: 'exports',
				order: [
					{
						key: '.*',
						order: ['types', '.*', 'default'],
					},
				],
			},
		]);
	});

	it('should adjust the provided object if there is one', async () => {
		const normalizer = await createJsonSortingPreferenceNormalizer('package.json');
		expect(readJsonMock).toHaveBeenCalledTimes(1);
		expect(typeof normalizer).toEqual('function');
		const order = normalizer(['name', 'description']);
		expect(order).toBeDefined();
		expect(order).toEqual([
			'name',
			'description',
			{
				key: 'exports',
				order: [
					{
						key: '.*',
						order: ['types', '.*', 'default'],
					},
				],
			},
		]);
	});

	it('should return the opinionated default package.json order when there is no package.sort.json', async () => {
		readJsonMock.mockReturnValueOnce(undefined);
		const normalizer = await createJsonSortingPreferenceNormalizer('package.json');
		expect(readJsonMock).toHaveBeenCalledTimes(1);
		expect(typeof normalizer).toEqual('function');
		const order = normalizer();
		expect(order).toBeDefined();
		expect(order).toEqual(DEFAULT_PACKAGE_JSON_SORTING_PREFERENCE);
	});
});
