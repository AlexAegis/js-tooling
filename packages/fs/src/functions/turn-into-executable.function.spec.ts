import { createMockLogger } from '@alexaegis/logging/mocks';
import { join } from 'node:path/posix';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { mockChmod, mockReadFile, mockWriteFile } from '../../__mocks__/fs/promises.js';
import { NODE_SHEBANG, SHELL_SHEBANG, TSNODE_SHEBANG } from './shebangs.const.js';
import { turnIntoExecutable } from './turn-into-executable.function.js';

export const mockProcessCwdValue = '/foo';

vi.spyOn(process, 'cwd').mockReturnValue(mockProcessCwdValue);
vi.mock('node:fs/promises');

describe('turnIntoExecutable', () => {
	const { logger, mockLogger } = createMockLogger(vi);

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('file existence', () => {
		it('should report an error if it receives non-existent file', async () => {
			await turnIntoExecutable('nonexistent', {
				logger,
			});

			expect(mockLogger.error).toHaveBeenCalledOnce();
		});

		it('should report an error if it receives something else than a file', async () => {
			await turnIntoExecutable('directory', { logger });

			expect(mockLogger.error).toHaveBeenCalledOnce();
		});
	});

	describe('chmod', () => {
		it('should not call chmod on already executable files', async () => {
			await turnIntoExecutable('executable.sh', { logger });
			expect(mockChmod).not.toHaveBeenCalled();
		});

		it('should call chmod on not executable files that should be executable', async () => {
			await turnIntoExecutable('file.sh', { logger });
			expect(mockChmod).toHaveBeenCalled();
			expect(mockLogger.info).toHaveBeenCalled();
		});

		it('should report the error if something happens during chmod', async () => {
			mockChmod.mockImplementationOnce(
				() =>
					new Promise(() => {
						throw new Error('error!');
					}),
			);
			await turnIntoExecutable('file.sh', { logger });
			expect(mockChmod).toHaveBeenCalled();
			expect(mockLogger.error).toHaveBeenCalled();
		});
	});

	describe('file that should have a shebang', () => {
		it('should not change existing shebangs', async () => {
			const existingShebang = '#!existingshebang!';
			mockReadFile.mockImplementationOnce(() => {
				return existingShebang;
			});

			await turnIntoExecutable('file.sh', { logger });

			expect(mockWriteFile).not.toHaveBeenCalled();
		});

		it('should not write files that cannot be read', async () => {
			mockReadFile.mockImplementationOnce(() => {
				throw new Error('some error');
			});

			await turnIntoExecutable('file.sh', { logger });

			expect(mockWriteFile).not.toHaveBeenCalled();
		});

		it('should prepend shell files with a POSIX shebang', async () => {
			const mockContent = 'foo sh file';
			mockReadFile.mockImplementationOnce(() => {
				return mockContent;
			});

			const mockPath = 'file.sh';
			await turnIntoExecutable(mockPath, { logger });

			expect(mockWriteFile).toHaveBeenCalledWith(
				join(mockProcessCwdValue, mockPath),
				`${SHELL_SHEBANG}\n\n${mockContent}`,
			);

			expect(mockLogger.info).toHaveBeenCalled();
		});

		it('should prepend js files with a node shebang', async () => {
			const mockContent = 'foo js file';
			mockReadFile.mockImplementationOnce(() => {
				return mockContent;
			});

			const mockPath = 'file.js';
			await turnIntoExecutable(mockPath, { logger });

			expect(mockWriteFile).toHaveBeenCalledWith(
				join(mockProcessCwdValue, mockPath),
				`${NODE_SHEBANG}\n\n${mockContent}`,
			);
		});

		it('should prepend ts files with a tsnode shebang', async () => {
			const mockContent = 'foo ts file';
			mockReadFile.mockImplementationOnce(() => {
				return mockContent;
			});

			const mockPath = 'file.ts';
			await turnIntoExecutable(mockPath, { logger });

			expect(mockWriteFile).toHaveBeenCalledWith(
				join(mockProcessCwdValue, mockPath),
				`${TSNODE_SHEBANG}\n\n${mockContent}`,
			);
		});
	});
});
