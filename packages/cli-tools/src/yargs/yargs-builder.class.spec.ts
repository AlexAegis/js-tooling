import { describe, expect, it, vi } from 'vitest';
import type { Argv } from 'yargs';
import { YargsBuilder } from './yargs-builder.class.js';
describe('YargsBuilder', () => {
	it('should be able to create an empty builder', () => {
		const builder = YargsBuilder.empty();

		expect(builder).toBeDefined();
	});

	it('should only call mutators once built', () => {
		const builder = YargsBuilder.withDefaults();
		const mockMutator = vi.fn((yargs: Argv) => yargs.option('test', {}));
		builder.add(mockMutator);
		expect(mockMutator).not.toHaveBeenCalled();
		const y = builder.build();
		expect(mockMutator).toHaveBeenCalled();
		expect(y).toBeDefined();
	});
});
