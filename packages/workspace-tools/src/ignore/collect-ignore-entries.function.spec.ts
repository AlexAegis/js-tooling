import type { PathLike } from 'node:fs';
import { join } from 'node:path/posix';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockProjectRoot } from '../../__mocks__/fs.js';
import { readFileMock } from '../../__mocks__/fs/promises.js';
import { collectIgnoreEntries } from './collect-ignore-entries.function.js';
import { GITIGNORE_FILENAME } from './collect-ignore-entries.function.options.js';

vi.mock('node:fs/promises');
vi.mock('node:fs');

const cwdSpy = vi.spyOn(process, 'cwd');

describe('collectIgnoreEntries', () => {
	beforeEach(() => {
		readFileMock.mockImplementation((path: PathLike): Promise<string | undefined> => {
			switch (path) {
				case join(mockProjectRoot, GITIGNORE_FILENAME): {
					return Promise.resolve(`foo# comment

				# comment`);
				}
				case join(mockProjectRoot, 'packages/zed', GITIGNORE_FILENAME): {
					return Promise.resolve(`bar# comment
				zed
				# comment`);
				}
				case join('/', GITIGNORE_FILENAME): {
					return Promise.resolve('root');
				}
				default: {
					return Promise.resolve(undefined);
				}
			}
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should collect the non-commented content the root gitignore file when asked from there', async () => {
		cwdSpy.mockImplementation(() => mockProjectRoot);

		const result = await collectIgnoreEntries({ ignoreFileName: GITIGNORE_FILENAME });

		expect(result).toEqual(['foo']);
	});

	it('should collect all the non-commented content the root and package gitignore file when asked from there', async () => {
		cwdSpy.mockImplementation(() => join(mockProjectRoot, 'packages/zed/asd/few'));

		const result = await collectIgnoreEntries({ ignoreFileName: GITIGNORE_FILENAME });

		expect(result).toEqual(['foo', 'bar', 'zed']);
	});

	it('should throw an error outside of a workspace', async () => {
		cwdSpy.mockImplementation(() => '/');

		await expect(
			collectIgnoreEntries({ ignoreFileName: GITIGNORE_FILENAME }),
		).rejects.toBeDefined();
	});
});
