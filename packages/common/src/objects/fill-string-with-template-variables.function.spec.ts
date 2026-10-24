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

	it('should insert values that contain replacement patterns as they are', () => {
		const filled = fillStringWithTemplateVariables('x ${a} ${b}', { a: 'p$&q', b: 'p$$q' });

		expect(filled).toEqual('x p$&q p$$q');
	});

	it('should not fill variables inside an inserted value', () => {
		expect(fillStringWithTemplateVariables('${a}', { a: '${b}', b: 'X' })).toEqual('${b}');
		expect(fillStringWithTemplateVariables('${a}', { b: 'X', a: '${b}' })).toEqual('${b}');
	});

	it('should keep unknown variables', () => {
		expect(fillStringWithTemplateVariables('${a} ${c}', { a: 'A' })).toEqual('A ${c}');
	});

	it('should fill a variable inside another ${ expression', () => {
		expect(fillStringWithTemplateVariables('${{ ${a} }}', { a: 'A' })).toEqual('${{ A }}');
		expect(
			fillStringWithTemplateVariables("startsWith('${')) {\n\treturn '${a}';\n}", { a: 'A' }),
		).toEqual("startsWith('${')) {\n\treturn 'A';\n}");
	});
});
