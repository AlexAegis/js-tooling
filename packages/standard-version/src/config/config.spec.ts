import { describe, expect, it, vi } from 'vitest';
import { createStandardVersionConfig } from './config.js';
import { resolveChangelogPreset } from './resolve-changelog-preset.js';

vi.mock('../workspace/collect-packages.js', () => ({
	collectPackages: () => ({
		workspacePackage: { packagePath: '/workspace', packageJsonPath: '/workspace/package.json' },
		subPackages: [],
	}),
}));

vi.mock('./resolve-changelog-preset.js', () => ({ resolveChangelogPreset: vi.fn() }));

describe('createStandardVersionConfig', () => {
	it('should pass the resolved changelog preset', () => {
		const preset = { name: '/preset/src/index.js' };
		vi.mocked(resolveChangelogPreset).mockReturnValue(preset);

		expect(createStandardVersionConfig()).toMatchObject({ preset });
		expect(resolveChangelogPreset).toHaveBeenCalledWith('/workspace');
	});

	it('should keep the default preset without commit-and-tag-version', () => {
		vi.mocked(resolveChangelogPreset).mockReturnValue(undefined);

		expect(createStandardVersionConfig()).not.toHaveProperty('preset');
	});
});
