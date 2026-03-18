import { describe, expect, it } from 'vitest';
import { findMostSensibleMatch, sortObject } from './sort-object.function.js';

describe('reorderObject', () => {
	it('should be able to order simple objects in alphabetical order', () => {
		const from = {
			c: 'c',
			a: 'a',
			b: 'b',
		};

		const to = {
			a: 'a',
			b: 'b',
			c: 'c',
		};

		expect(JSON.stringify(sortObject(from), undefined, 2)).toEqual(
			JSON.stringify(to, undefined, 2),
		);
	});

	it('should be able to order an array', () => {
		const from = ['c', 'a', 'b'];

		const to = ['a', 'b', 'c'];

		expect(JSON.stringify(sortObject(from), undefined, 2)).toEqual(
			JSON.stringify(to, undefined, 2),
		);
	});

	it('should be able to order simple nested objects in alphabetical order', () => {
		const from = {
			c: 'c',
			a: 'a',
			b: {
				c: 'c',
				a: 'a',
				b: 'b',
			},
		};

		const to = {
			a: 'a',
			b: {
				a: 'a',
				b: 'b',
				c: 'c',
			},
			c: 'c',
		};

		expect(JSON.stringify(sortObject(from, []), undefined, 2)).toEqual(
			JSON.stringify(to, undefined, 2),
		);
	});

	it('should order flat objects based on an ordering preference', () => {
		const from = {
			c: 'c',
			a: 'a',
			b: 'b',
		};

		const to = {
			c: 'c',
			b: 'b',
			a: 'a',
		};

		expect(JSON.stringify(sortObject(from, ['c', 'b', 'a']), undefined, 2)).toEqual(
			JSON.stringify(to, undefined, 2),
		);
	});

	it('should order flat objects based on an ordering preference, filling gaps in alphabetical order', () => {
		const from = {
			d: 'd',
			g: 'g',
			a: 'a',
			b: 'b',
			f: 'f',
			c: 'c',
			e: 'e',
		};

		const to = {
			d: 'd',
			a: 'a',
			b: 'b',
			c: 'c',
			e: 'e',
			g: 'g',
			f: 'f',
		};

		expect(JSON.stringify(sortObject(from, ['d', '.*', 'f']), undefined, 2)).toEqual(
			JSON.stringify(to, undefined, 2),
		);
	});

	it('should order flat objects based on an ordering preference, not filling gaps if not allowed', () => {
		const from = {
			d: 'd',
			g: 'g',
			a: 'a',
			b: 'b',
			f: 'f',
			c: 'c',
			e: 'e',
		};

		const to = {
			d: 'd',
			f: 'f',
			a: 'a',
			b: 'b',
			c: 'c',
			e: 'e',
			g: 'g',
		};

		const result = JSON.stringify(sortObject(from, ['d', 'f']), undefined, 2);

		expect(result).toEqual(JSON.stringify(to, undefined, 2));
	});

	it('should order based on an ordering preference', () => {
		const from = {
			zed: 'zed',
			mode: 'mode',
			name: 'name',
			stuff: {
				c: ['b', 'a', 'c'],
				b: 'b',
				a: 'a',
				['prefixed:c']: 'prefixed:c',
				['prefixed:b']: 'prefixed:b',
				['prefixed:a']: 'prefixed:a',
			},
		};

		const to = {
			name: 'name',
			mode: 'mode',
			stuff: {
				['prefixed:a']: 'prefixed:a',
				['prefixed:b']: 'prefixed:b',
				['prefixed:c']: 'prefixed:c',
				a: 'a',
				b: 'b',
				c: ['a', 'b', 'c'],
			},
			zed: 'zed',
		};

		expect(
			JSON.stringify(
				sortObject(from, [
					'name',
					'mode',
					{ key: 'stuff', order: ['prefixed:.*', '.*'] },
					'.*',
				]),
				undefined,
				2,
			),
		).toEqual(JSON.stringify(to, undefined, 2));
	});

	it('should select a filling spot around hard values based on alphabetical order', () => {
		const from = {
			d: 'd',
			g: 'g',
			a: 'a',
			b: 'b',
			f: 'f',
			c: 'c',
			e: 'e',
		};

		const to = {
			a: 'a',
			b: 'b',
			c: 'c',
			d: 'd',
			f: 'f',
			e: 'e',
			g: 'g',
		};

		const result = JSON.stringify(sortObject(from, ['.*', 'd', 'f', '.*']), undefined, 2);
		expect(result).toEqual(JSON.stringify(to, undefined, 2));
	});

	it('should treat exact matches with a higher priority', () => {
		// Since everything in the ordering is turned into a regex, it could partially match with unintended keys.
		const from = {
			build: 'build',
			'other:build:bar': 'build bar',
			almond: 'almond',
		};

		const to = {
			build: 'build',
			almond: 'almond',
			'other:build:bar': 'build bar',
		};

		expect(JSON.stringify(sortObject(from, ['build', 'almond', '.*']), undefined, 2)).toEqual(
			JSON.stringify(to, undefined, 2),
		);
	});

	it('should order based on an ordering preference', () => {
		const from = {
			name: 'foo',
			exports: {
				'./readme': './readme.md',
				'./foo': {
					require: './dist/index.cjs',
					import: './dist/index.js',
					types: './dist/index.d.ts',
				},
				'.': {
					require: './dist/index.cjs',
					import: './dist/index.js',
					types: './dist/index.d.ts',
				},
			},
		};

		const to = {
			name: 'foo',
			exports: {
				'.': {
					types: './dist/index.d.ts',
					import: './dist/index.js',
					require: './dist/index.cjs',
				},
				'./foo': {
					types: './dist/index.d.ts',
					import: './dist/index.js',
					require: './dist/index.cjs',
				},
				'./readme': './readme.md',
			},
		};

		expect(
			JSON.stringify(
				sortObject(from, [
					'name',
					{ key: 'exports', order: [{ key: '.*', order: ['types', '.*'] }] },
				]),
				undefined,
				2,
			),
		).toEqual(JSON.stringify(to, undefined, 2));
	});

	it('should order based on an ordering preference using RegExp like strings', () => {
		const from = {
			'other-build': 'build other',
			'test:bar': 'test bar',
		};

		const to = {
			'test:bar': 'test bar',
			'other-build': 'build other',
		};

		expect(JSON.stringify(sortObject(from, ['^build.*', '^test.*']), undefined, 2)).toEqual(
			JSON.stringify(to, undefined, 2),
		);
	});

	it('should order subobjects even if they are not mentioned in detail', () => {
		const from = {
			zed: 'zed',
			mode: 'mode',
			name: 'name',
			stuff: {
				c: 'c',
				b: 'b',
				a: 'a',
			},
		};

		const to = {
			name: 'name',
			mode: 'mode',
			stuff: {
				a: 'a',
				b: 'b',
				c: 'c',
			},
			zed: 'zed',
		};

		expect(JSON.stringify(sortObject(from, ['name', 'mode', 'stuff']), undefined, 2)).toEqual(
			JSON.stringify(to, undefined, 2),
		);
	});

	describe('findMostSensibleMatch', () => {
		it('should find MostSensibleMatch', () => {
			const matchers = [/.*/, /b/, /.*/];
			expect(findMostSensibleMatch(matchers, 'a')).toEqual(0);
			expect(findMostSensibleMatch(matchers, 'b')).toEqual(1);
			expect(findMostSensibleMatch(matchers, 'c')).toEqual(2);
			expect(findMostSensibleMatch(matchers, 'd')).toEqual(2);
		});
	});
});
