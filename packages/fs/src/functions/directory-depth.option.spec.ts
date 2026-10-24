import { describe, expect, it } from 'vitest';
import {
	normalizeDirectoryDepthOption,
	type NormalizedDirectoryDepthOption,
} from './directory-depth.option.js';

describe('normalizeDepthOption', () => {
	it('should default Infinity when not defined', () => {
		expect(normalizeDirectoryDepthOption()).toEqual({
			depth: Infinity,
		} satisfies NormalizedDirectoryDepthOption);
	});

	it('cwd: process.cwd()', () => {
		const depthOverride = 2;
		expect(normalizeDirectoryDepthOption({ depth: depthOverride })).toEqual({
			depth: depthOverride,
		} satisfies NormalizedDirectoryDepthOption);
	});
});
