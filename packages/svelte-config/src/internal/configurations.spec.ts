import { describe, expect, it } from 'vitest';
import { kitConfiguration } from './configurations.js';

describe('kitConfiguration', () => {
	it('should hold the options of the sveltekit plugin without nesting', () => {
		expect(kitConfiguration).not.toHaveProperty('kit');
		expect(kitConfiguration).not.toHaveProperty('vitePlugin');
		expect(kitConfiguration.adapter).toBeDefined();
		expect(kitConfiguration.preprocess).toBeDefined();
		expect(kitConfiguration.inspector).toBeDefined();
		expect(kitConfiguration.paths).toHaveProperty('base');
	});
});
