import { describe, expect, it, vi } from 'vitest';
import { ALL_NPM_HOOKS } from '../../index.js';
import {
	DEFAULT_BINSHIM_DIR,
	DEFAULT_BIN_DIR,
	DEFAULT_PACKAGE_EXPORT_IGNORES,
} from '../../internal/defaults.const.js';
import {
	normalizeAutoBinOptions,
	type AutoBinOptions,
	type NormalizedAutoBinOptions,
} from './auto-bin.class.options.js';

vi.spyOn(process, 'cwd').mockReturnValue('/foo');

describe('normalizeAutoBinOptions', () => {
	it('should have a default when not defined', () => {
		expect(normalizeAutoBinOptions()).toEqual({
			binBaseDir: DEFAULT_BIN_DIR,
			binIgnore: [],
			bins: '*',
			defaultBinIgnore: DEFAULT_PACKAGE_EXPORT_IGNORES,
			shimDir: DEFAULT_BINSHIM_DIR,
			enabledNpmHooks: ALL_NPM_HOOKS,
		} as NormalizedAutoBinOptions);
	});

	it('should use the provided values when defined', () => {
		const manualOptions: AutoBinOptions = {
			binIgnore: ['asd'],
			binBaseDir: 'foo',
			bins: 'bin-*',
			defaultBinIgnore: [],
			shimDir: 'shimdir',
			enabledNpmHooks: [],
		};
		expect(normalizeAutoBinOptions(manualOptions)).toEqual(manualOptions);
	});
});
