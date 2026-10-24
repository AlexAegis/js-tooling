import { existsSync, mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { resolveChangelogPreset } from './resolve-changelog-preset.js';

const PRESET_NAME = 'conventional-changelog-conventionalcommits';

const writePackageJson = (directory: string, packageJson: object): string => {
	mkdirSync(directory, { recursive: true });
	writeFileSync(join(directory, 'package.json'), JSON.stringify(packageJson));
	return directory;
};

describe('resolveChangelogPreset', () => {
	let workspaceRoot: string;
	let nodeModulesPath: string;
	let releaseToolPath: string;

	beforeEach(() => {
		const temporaryDirectory = mkdtempSync(join(tmpdir(), 'standard-version-'));
		workspaceRoot = realpathSync(temporaryDirectory);
		nodeModulesPath = join(workspaceRoot, 'node_modules');
		releaseToolPath = writePackageJson(join(nodeModulesPath, 'commit-and-tag-version'), {});
		const specPath = writePackageJson(
			join(nodeModulesPath, 'conventional-changelog-config-spec'),
			{
				main: 'index.js',
			},
		);
		writeFileSync(
			join(specPath, 'index.js'),
			'module.exports = { properties: { preMajor: { default: false } } };',
		);
	});

	afterEach(() => {
		rmSync(workspaceRoot, { recursive: true, force: true });
	});

	it('should prefer the preset nested in commit-and-tag-version over a hoisted one', () => {
		writePackageJson(join(nodeModulesPath, PRESET_NAME), { exports: './hoisted.js' });
		const presetPath = writePackageJson(join(releaseToolPath, 'node_modules', PRESET_NAME), {
			exports: { types: './src/index.d.ts', import: './src/index.js' },
		});

		expect(resolveChangelogPreset(workspaceRoot)).toEqual({
			preMajor: false,
			name: join(presetPath, 'src', 'index.js'),
		});
	});

	it('should use the preset next to commit-and-tag-version', () => {
		const presetPath = writePackageJson(join(nodeModulesPath, PRESET_NAME), {
			exports: './src/index.js',
		});

		expect(resolveChangelogPreset(workspaceRoot)).toMatchObject({
			name: join(presetPath, 'src', 'index.js'),
		});
	});

	it('should use the main field of a preset without exports', () => {
		const presetPath = writePackageJson(join(nodeModulesPath, PRESET_NAME), {
			main: 'lib/preset.js',
		});

		expect(resolveChangelogPreset(workspaceRoot)).toMatchObject({
			name: join(presetPath, 'lib', 'preset.js'),
		});
	});

	it('should return undefined without commit-and-tag-version', () => {
		rmSync(releaseToolPath, { recursive: true });

		expect(resolveChangelogPreset(workspaceRoot)).toBeUndefined();
	});

	it('should throw without the preset', () => {
		expect(() => resolveChangelogPreset(workspaceRoot)).toThrow('is not installed');
	});

	it('should throw for unknown preset exports', () => {
		writePackageJson(join(nodeModulesPath, PRESET_NAME), {
			exports: { '.': { import: './src/index.js' } },
			main: 'index.js',
		});

		expect(() => resolveChangelogPreset(workspaceRoot)).toThrow('No supported entry');
	});

	it('should resolve the preset installed in this repository with perf commits hidden', () => {
		const preset = resolveChangelogPreset(join(import.meta.dirname, '..', '..', '..', '..'));

		expect(preset?.['name']).toContain(PRESET_NAME);
		expect(existsSync(preset?.['name'] as string)).toBe(true);
		expect(preset?.['types']).toContainEqual({ type: 'perf', hidden: true });
	});
});
