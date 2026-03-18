import { describe, expect, it } from 'vitest';
import { getEncodedArchetype } from './package-archetype.interface.js';

describe('getEncodedArchetype', () => {
	it('should assemble a full archetype in a fixed order', () => {
		expect(
			getEncodedArchetype({
				platform: 'node',
				kind: 'lib',
			}),
		).toEqual('node-lib');
		expect(
			getEncodedArchetype({
				kind: 'lib',
				platform: 'node',
			}),
		).toEqual('node-lib');
	});

	it('should skip nullish values', () => {
		expect(
			getEncodedArchetype({
				platform: 'node',
				kind: undefined,
			}),
		).toEqual('node');
	});

	it('should be able to convert a fully qualified archetype', () => {
		expect(
			getEncodedArchetype({
				platform: 'web',
				kind: 'app',
				language: 'ts',
				framework: 'svelte',
				bundler: 'vite',
				testing: 'vitest',
			}),
		).toEqual('web-svelte-ts-app-vite-vitest');
	});

	it('should return an empty string when the archetype itself is nullish', () => {
		expect(getEncodedArchetype()).toEqual('');
	});
});
