import { describe, expect, it } from 'vitest';
import {
	DEFAULT_EXPORT_FORMATS,
	DEFAULT_VITE_LIB_CONFIG,
	defineViteLibConfig,
} from './base-vite.config.js';

describe('defineViteLibConfig', () => {
	it('defaults to the shared export formats', () => {
		expect(defineViteLibConfig().build?.lib).toMatchObject({ formats: DEFAULT_EXPORT_FORMATS });
	});

	it('is equivalent to DEFAULT_VITE_LIB_CONFIG when called with no options', () => {
		// `external` is a fresh closure per call, so compare the serialisable
		// build.lib shape rather than the whole (function-carrying) config.
		expect(defineViteLibConfig().build?.lib).toEqual(DEFAULT_VITE_LIB_CONFIG.build?.lib);
	});

	it('replaces formats instead of concatenating them', () => {
		expect(defineViteLibConfig({ formats: ['es'] }).build?.lib).toMatchObject({
			formats: ['es'],
		});
	});

	it('allows overriding the entry', () => {
		const entry = { main: 'src/main.ts' };
		expect(defineViteLibConfig({ entry }).build?.lib).toMatchObject({ entry });
	});
});
