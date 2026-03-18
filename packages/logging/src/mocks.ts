import type { vi } from 'vitest';
import type { Logger } from './index.js';

export interface MockLogger {
	silly: ReturnType<typeof vi.fn>;
	trace: ReturnType<typeof vi.fn>;
	debug: ReturnType<typeof vi.fn>;
	log: ReturnType<typeof vi.fn>;
	info: ReturnType<typeof vi.fn>;
	warn: ReturnType<typeof vi.fn>;
	fatal: ReturnType<typeof vi.fn>;
	error: ReturnType<typeof vi.fn>;
	attachTransport: ReturnType<typeof vi.fn>;
	getSubLogger: ReturnType<typeof vi.fn>;
}

/**
 * The vi object is passed because if there's a version mismatch in a pnpm
 * workspace between this package and its consumer, a different vitest will
 * initialize these mock functions and you wouldn't be able to reset/clear
 * mocks
 *
 * It will return a logger wrapped in an object, under two keys:
 * one with the mock type to let you use them as mocks, and one with the real
 * Logger type so you can pass it around. Both are the same object instance.
 */
export const createMockLogger = (
	vi: typeof import('vitest').vi,
): { mockLogger: MockLogger; logger: Logger<unknown> } => {
	const mockLogger: MockLogger = {
		silly: vi.fn(),
		trace: vi.fn(),
		debug: vi.fn(),
		log: vi.fn(),
		info: vi.fn(),
		warn: vi.fn(),
		fatal: vi.fn(),
		error: vi.fn(),
		attachTransport: vi.fn(),
		getSubLogger: vi.fn(),
	};

	return { logger: mockLogger as unknown as Logger<unknown>, mockLogger };
};
