import { deepMapObject } from './deep-map-object.function.js';
import { fillStringWithTemplateVariables } from './fill-string-with-template-variables.function.js';
import type { SimpleObjectKey } from './struct.type.js';

/**
 * Maps and fills every string value in an object based on a variableMap.
 *
 * If the target object has a string value containing `"${variableName}"`, the
 * corresponding value from the variableMap will be substitued into it.
 */
export const fillObjectWithTemplateVariables = <
	VariableKeys extends SimpleObjectKey,
	T extends Record<string | number, unknown> = Record<string | number, unknown>,
>(
	target: T,
	variables: Record<VariableKeys, string>,
): T => {
	return deepMapObject(target, (_key, value) => {
		return typeof value === 'string'
			? fillStringWithTemplateVariables(value, variables)
			: value;
	});
};
