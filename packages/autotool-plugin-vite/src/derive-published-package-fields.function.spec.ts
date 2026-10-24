import type { PackageJson } from '@alexaegis/workspace-tools';
import { describe, expect, it } from 'vitest';
import { derivePublishedPackageFields } from './derive-published-package-fields.function.js';

describe('derivePublishedPackageFields', () => {
	it('should point the types of a ts library at the declarations in dist', () => {
		const result = derivePublishedPackageFields({
			exports: {
				'.': {
					types: './src/index.ts',
					import: './dist/index.js',
					require: './dist/index.cjs',
					default: './dist/index.js',
				},
				'./package.json': './package.json',
				'./readme': './readme.md',
			},
		});

		expect(result).toEqual({
			files: ['dist'],
			publishConfigExports: {
				'.': {
					types: './dist/index.d.ts',
					import: './dist/index.js',
					require: './dist/index.cjs',
					default: './dist/index.js',
				},
				'./package.json': './package.json',
				'./readme': './readme.md',
			},
		});
	});

	it('should point every condition of a js library at dist', () => {
		const result = derivePublishedPackageFields({
			exports: {
				'.': {
					types: './src/index.js',
					import: './src/index.js',
					require: './src/index.cjs',
					default: './src/index.js',
				},
			},
		});

		expect(result?.publishConfigExports).toEqual({
			'.': {
				types: './dist/index.d.ts',
				import: './dist/index.js',
				require: './dist/index.cjs',
				default: './dist/index.js',
			},
		});
	});

	it('should publish a handwritten declaration from src without its js conditions', () => {
		const result = derivePublishedPackageFields({
			exports: {
				'./ambient': {
					types: './src/ambient.d.ts',
					import: './dist/ambient.js',
					require: './dist/ambient.cjs',
					default: './dist/ambient.js',
				},
			},
		});

		expect(result).toEqual({
			files: ['dist', 'src/ambient.d.ts'],
			publishConfigExports: { './ambient': { types: './src/ambient.d.ts' } },
		});
	});

	it('should list the top level folders and files of exports outside dist', () => {
		const result = derivePublishedPackageFields({
			exports: {
				'./base': './base.json',
				'./cicd': './static/cicd.yml',
				'./funding': './static/funding.yml',
			},
		});

		expect(result?.files).toEqual(['base.json', 'dist', 'static']);
	});

	it('should keep the existing files entries', () => {
		const result = derivePublishedPackageFields({
			files: ['templates', 'dist'],
			exports: { './cicd': './static/cicd.yml' },
		});

		expect(result?.files).toEqual(['dist', 'static', 'templates']);
	});

	it('should keep a handwritten declaration exported as a string in src', () => {
		const result = derivePublishedPackageFields({
			exports: { './types': './src/types.d.ts' },
		});

		expect(result).toEqual({
			files: ['dist', 'src/types.d.ts'],
			publishConfigExports: { './types': './src/types.d.ts' },
		});
	});

	it('should only list dist when there are no exports', () => {
		const result = derivePublishedPackageFields({});

		expect(result).toEqual({ files: ['dist'], publishConfigExports: undefined });
	});

	it.each([
		['a string', './dist/index.js'],
		['top level conditions', { types: './src/index.ts', default: './dist/index.js' }],
		['nested conditions', { '.': { import: { types: './src/index.ts' } } }],
		// eslint-disable-next-line unicorn/no-null -- package.json exports use null to exclude a subpath
		['a null target', { './internal/*': null }],
		['an array fallback', { '.': ['./dist/index.js'] }],
		['an mts source', { '.': { types: './src/index.mts' } }],
		['a tsx source', { '.': { types: './src/index.tsx' } }],
		['a cjs types source', { '.': { types: './src/index.cjs' } }],
		['a target without ./', { '.': { types: 'src/index.ts' } }],
		['a target outside the package', { './shared': './dist/../../shared/index.js' }],
		[
			'a src declaration with js in src',
			{ '.': { types: './src/index.d.ts', import: './src/index.js' } },
		],
		[
			'a src declaration with js outside dist',
			{ '.': { types: './src/index.d.ts', default: './static/index.js' } },
		],
	])('should not derive anything for %s as exports', (_shape, exports) => {
		const result = derivePublishedPackageFields({ exports } as unknown as PackageJson);

		expect(result).toBeUndefined();
	});

	it.each([
		['a string', 'dist'],
		['a list with a number', ['dist', 1]],
	])('should not derive anything when files is %s', (_shape, files) => {
		const result = derivePublishedPackageFields({ files } as unknown as PackageJson);

		expect(result).toBeUndefined();
	});

	it('should keep the versioned types conditions of a src declaration', () => {
		const result = derivePublishedPackageFields({
			exports: {
				'.': {
					types: './src/index.d.ts',
					'types@<5.0': './src/old.ts',
					default: './dist/index.js',
				},
			},
		});

		expect(result?.publishConfigExports).toEqual({
			'.': { types: './src/index.d.ts', 'types@<5.0': './dist/old.d.ts' },
		});
	});

	it('should map the js conditions next to a versioned src declaration', () => {
		const result = derivePublishedPackageFields({
			exports: {
				'.': {
					'types@<5.0': './src/old.d.ts',
					types: './src/index.js',
					import: './src/index.js',
				},
			},
		});

		expect(result).toEqual({
			files: ['dist', 'src/old.d.ts'],
			publishConfigExports: {
				'.': {
					'types@<5.0': './src/old.d.ts',
					types: './dist/index.d.ts',
					import: './dist/index.js',
				},
			},
		});
	});

	it('should list a folder whose name starts with readme', () => {
		const result = derivePublishedPackageFields({
			exports: { './logo': './readme-assets/logo.png' },
		});

		expect(result?.files).toEqual(['dist', 'readme-assets']);
	});

	it('should map a versioned types condition to declarations', () => {
		const result = derivePublishedPackageFields({
			exports: { '.': { 'types@<5.0': './src/old.ts', types: './src/index.ts' } },
		});

		expect(result?.publishConfigExports).toEqual({
			'.': { 'types@<5.0': './dist/old.d.ts', types: './dist/index.d.ts' },
		});
	});
});
