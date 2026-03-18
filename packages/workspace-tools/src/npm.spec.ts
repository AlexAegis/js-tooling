import { describe, expect, it } from 'vitest';
import * as npm from './npm.js';

describe('npm', () => {
	it('should be defined', () => {
		expect(npm).toBeDefined();
	});
});
