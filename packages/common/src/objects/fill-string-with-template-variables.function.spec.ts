import { describe, expect, it } from 'vitest';
import { fillStringWithTemplateVariables } from './fill-string-with-template-variables.function.js';

describe('fillStringWithTemplateVariables', () => {
	it('should fill in declared variables in an object', () => {
		const variableMap = {
			foo: 'fooValue',
			bar: 'barValue',
		};
		const source = 'fooBar: ${foo} ${bar}';

		const expected = 'fooBar: fooValue barValue';
		const filled = fillStringWithTemplateVariables(source, variableMap);

		expect(filled).toEqual(expected);
	});
});
