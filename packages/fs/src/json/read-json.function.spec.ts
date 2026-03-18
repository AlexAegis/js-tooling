import { createMockLogger } from '@alexaegis/logging/mocks';
import type { PathLike } from 'node:fs';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { readJson } from './read-json.function.js';

const testJson = {
	foo: { bar: 1, zed: 'hello' },
};

describe('readJson', () => {
	const { logger, mockLogger } = createMockLogger(vi);

	beforeAll(() => {
		vi.spyOn(console, 'error').mockImplementation(() => undefined);
		vi.mock('node:fs/promises', () => {
			return {
				readFile: vi.fn(
					async (path: PathLike): Promise<string | undefined> =>
						new Promise((resolve, reject) => {
							if (path.toString().endsWith('.json')) {
								resolve(JSON.stringify(testJson));
							} else if (path.toString().endsWith('.txt')) {
								resolve('hello world!');
							} else if (path.toString() === 'error') {
								reject(new Error('File error!'));
							} else {
								resolve(undefined);
							}
						}),
				),
			};
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('valid cases', () => {
		it('should return the testJson parsed when read from a file', async () => {
			const result = await readJson<typeof testJson>('test.json');
			expect(result).toEqual(testJson);
		});
	});

	describe('invalid cases', () => {
		it('should return undefined for nonexistent files', async () => {
			const result = await readJson('nonexistent');
			expect(result).toBeUndefined();
		});

		it('should return undefined when the fileReading results in an error', async () => {
			const result = await readJson('error');
			expect(result).toBeUndefined();
		});

		it('should return undefined and log the error when the fileReading results in an error', async () => {
			const result = await readJson('error', { logger });
			expect(result).toBeUndefined();
			expect(mockLogger.error).toHaveBeenCalled();
		});

		it('should return undefined when no path is given', async () => {
			const result = await readJson(undefined);
			expect(result).toBeUndefined();
		});

		it('should return undefined when when it is not json parsable', async () => {
			const result = await readJson('test.txt');
			expect(result).toBeUndefined();
		});

		it('should return undefined and log an error when when it is not json parsable', async () => {
			const result = await readJson('test.txt', { logger });
			expect(result).toBeUndefined();
			expect(mockLogger.error).toHaveBeenCalled();
		});
	});
});
