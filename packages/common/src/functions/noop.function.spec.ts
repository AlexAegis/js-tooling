import { describe, expect, it } from 'vitest';
import { noop, noopAsync } from './noop.function.js';

describe('noop', () => {
	describe('noop', () => {
		it('should return undefined', () => {
			// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
			expect(noop()).toBeUndefined();
		});
	});

	describe('noopPromise', () => {
		it('should return undefined asynchronously in micro mode', async () => {
			expect(await noopAsync('micro')).toBeUndefined();
		});

		it('should return undefined asynchronously in macro mode', async () => {
			expect(await noopAsync('macro')).toBeUndefined();
		});
	});
});
