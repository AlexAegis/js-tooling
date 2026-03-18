import { dump } from 'js-yaml';
import type { PathLike } from 'node:fs';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { readYaml } from './read-yaml.function.js';

const testData = {
	foo: { bar: 1, zed: 'hello' },
};

vi.mock('node:fs/promises', () => {
	return {
		readFile: vi.fn(
			async (path: PathLike): Promise<string | undefined> =>
				new Promise((resolve, reject) => {
					if (path.toString().endsWith('.yaml')) {
						resolve(dump(testData));
					} else if (path.toString().endsWith('.txt')) {
						resolve('323 \n! { hello world! }');
					} else if (path.toString() === 'error') {
						reject(new Error('File error!'));
					} else {
						resolve(undefined);
					}
				}),
		),
	};
});

describe('readYaml', () => {
	beforeAll(() => {
		vi.spyOn(console, 'error').mockImplementation(() => undefined);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('valid cases', () => {
		it('should return the testJson parsed when read from a file', async () => {
			const result = await readYaml<typeof testData>('test.yaml');
			expect(result).toEqual(testData);
		});
	});

	describe('invalid cases', () => {
		it('should return undefined for nonexistent files', async () => {
			const result = await readYaml('nonexistent');
			expect(result).toBeUndefined();
		});

		it('should return undefined when the fileReading results in an error', async () => {
			const result = await readYaml('error');
			expect(result).toBeUndefined();
		});

		it('should return undefined when no path is given', async () => {
			const result = await readYaml(undefined);
			expect(result).toBeUndefined();
		});

		it('should return undefined when when it is not yaml parsable', async () => {
			const result = await readYaml('test.txt');
			expect(result).toBeUndefined();
		});
	});
});
