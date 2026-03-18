import type { Options } from 'prettier';
import { vi } from 'vitest';

/**
 * Calling the mock format function of prettier will return this
 */
export const mockDefaultPrettifiedJsonOutput = 'prettyJson';

export interface MockPrettierReturn {
	prettier: typeof import('prettier');
	prettierMock: {
		format: ReturnType<typeof vi.fn<(s: string, o: Options) => Promise<string | undefined>>>;
		resolveConfig: ReturnType<typeof vi.fn<(_: string) => Promise<Options>>>;
	};
}

export const mockPrettier = (vi: typeof import('vitest').vi): MockPrettierReturn => {
	const mock = {
		format: vi.fn<(s: string, o: Options) => Promise<string | undefined>>(
			(_data: string) =>
				new Promise((resolve) => {
					resolve(mockDefaultPrettifiedJsonOutput);
				}),
		),
		resolveConfig: vi.fn<(_: string) => Promise<Options>>(),
	};

	return {
		prettier: mock as unknown as typeof import('prettier'),
		prettierMock: mock,
	};
};
