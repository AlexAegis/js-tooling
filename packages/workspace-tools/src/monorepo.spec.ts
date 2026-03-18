import { describe, expect, it } from 'vitest';
import * as monorepo from './monorepo.js';

describe('monorepo', () => {
	it('should be defined', () => {
		expect(monorepo).toBeDefined();
	});
});
