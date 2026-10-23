import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, parse } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	createLazyAutoExternalsFunction,
	DEFAULT_EXPORT_FORMATS,
	DEFAULT_VITE_LIB_CONFIG,
	defineViteLibConfig,
	getLibEntryFromExports,
} from './base-vite.config.js';

const writePackageJson = (directory: string, packageJson: object): string => {
	mkdirSync(directory, { recursive: true });
	writeFileSync(join(directory, 'package.json'), JSON.stringify(packageJson));
	return directory;
};

const writeEmptyFile = (path: string): void => {
	mkdirSync(dirname(path), { recursive: true });
	writeFileSync(path, '');
};

describe('getLibEntryFromExports', () => {
	let cwd: string;

	beforeEach(() => {
		cwd = mkdtempSync(join(tmpdir(), 'vite-lib-entry-'));
	});

	afterEach(() => {
		rmSync(cwd, { recursive: true, force: true });
	});

	it('falls back to the default entry without a package.json', () => {
		expect(getLibEntryFromExports({ cwd })).toEqual({ index: 'src/index.ts' });
	});

	it('falls back to the default entry when no entry can be derived', () => {
		writePackageJson(cwd, { name: 'package' });

		expect(getLibEntryFromExports({ cwd })).toEqual({ index: 'src/index.ts' });
	});

	it('derives entries from exports whose types condition points at a source file', () => {
		writePackageJson(cwd, {
			exports: {
				'.': { types: './src/index.ts', import: './dist/index.js' },
				'./helpers': { types: './src/helpers.ts' },
				'./built': { types: './dist/built.d.ts' },
				'./untyped': { import: './dist/untyped.js' },
				'./package.json': './package.json',
			},
			publishConfig: {
				exports: {
					'.': { types: './dist/index.d.ts', import: './dist/index.js' },
					'./published': { types: './src/published.ts' },
				},
			},
		});

		expect(getLibEntryFromExports({ cwd })).toEqual({
			index: 'src/index.ts',
			helpers: 'src/helpers.ts',
		});
	});

	it('adds published bin entries that map back to existing source files', () => {
		writeEmptyFile(join(cwd, 'src', 'bin', 'nuke.ts'));
		writeEmptyFile(join(cwd, 'bin', 'outside.ts'));
		writePackageJson(cwd, {
			exports: { '.': { types: './src/index.ts', import: './dist/index.js' } },
			bin: { nuke: './src/bin/nuke.ts' },
			publishConfig: {
				bin: {
					nuke: './dist/bin/nuke.js',
					missing: './dist/bin/missing.js',
					outside: './bin/outside.js',
				},
			},
		});

		expect(getLibEntryFromExports({ cwd })).toEqual({
			index: 'src/index.ts',
			'bin/nuke': 'src/bin/nuke.ts',
		});
	});
});

describe('createLazyAutoExternalsFunction', () => {
	let rootPath: string;

	const addPackage = (packagePath: string, packageJson: object): string =>
		writePackageJson(join(rootPath, packagePath), packageJson);

	const filterExternals = (
		isExternal: ReturnType<typeof createLazyAutoExternalsFunction>,
		sources: string[],
	): string[] => sources.filter((source) => isExternal(source, undefined, false));

	beforeEach(() => {
		rootPath = mkdtempSync(join(tmpdir(), 'vite-auto-externals-'));
	});

	afterEach(() => {
		vi.restoreAllMocks();
		rmSync(rootPath, { recursive: true, force: true });
	});

	it('treats the names and dependencies of the nearest two packages as external', () => {
		addPackage('.', { name: 'workspace', dependencies: { 'too-far': '^1.0.0' } });
		addPackage('outer', {
			name: 'outer',
			devDependencies: { 'outer-dev': '^1.0.0' },
			peerDependencies: { 'outer-peer': '^1.0.0' },
			optionalDependencies: { 'outer-optional': '^1.0.0' },
		});
		vi.spyOn(process, 'cwd').mockReturnValue(
			addPackage(join('outer', 'packages', 'inner'), {
				name: 'inner',
				dependencies: { 'inner-dep': '^1.0.0' },
			}),
		);

		expect(
			filterExternals(createLazyAutoExternalsFunction(), [
				'inner',
				'inner-dep',
				'inner-dep/sub',
				'inner-dependency',
				'outer',
				'outer-dev',
				'outer-peer',
				'outer-optional',
				'workspace',
				'too-far',
				'./local',
			]),
		).toEqual([
			'inner',
			'inner-dep',
			'inner-dep/sub',
			'outer',
			'outer-dev',
			'outer-peer',
			'outer-optional',
		]);
	});

	it('treats node builtins as external', () => {
		addPackage('.', {});
		vi.spyOn(process, 'cwd').mockReturnValue(addPackage('package', {}));

		expect(
			filterExternals(createLazyAutoExternalsFunction(), [
				'fs',
				'node:fs',
				'react',
				'./local',
			]),
		).toEqual(['fs', 'node:fs']);
	});

	it('stops looking for packages at the file system root', () => {
		vi.spyOn(process, 'cwd').mockReturnValue(parse(rootPath).root);

		expect(filterExternals(createLazyAutoExternalsFunction(), ['fs', 'node:fs'])).toEqual([
			'fs',
			'node:fs',
		]);
	});

	it('reads the package.json files at the first call and keeps the result', () => {
		addPackage('.', {});
		const isExternal = createLazyAutoExternalsFunction();
		const processCwdSpy = vi
			.spyOn(process, 'cwd')
			.mockReturnValue(addPackage('first', { dependencies: { first: '^1.0.0' } }));

		expect(isExternal('first', undefined, false)).toBe(true);

		processCwdSpy.mockReturnValue(addPackage('second', { dependencies: { second: '^1.0.0' } }));

		expect(isExternal('second', undefined, false)).toBe(false);
	});
});

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
