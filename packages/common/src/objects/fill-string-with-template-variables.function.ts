import type { SimpleObjectKey } from './struct.type.js';

/**
 * Maps and fills a single string value in an object based on a variableMap.
 *
 * If the target object has a string value containing `"${variableName}"`, the
 * corresponding value from the variableMap will be substitued into it.
 */
export const fillStringWithTemplateVariables = <VariableKeys extends SimpleObjectKey>(
	value: string,
	variables: Record<VariableKeys, string>,
): string => {
	return Object.entries<string>(variables).reduce((acc, [variableKey, variableValue]) => {
		return acc.replaceAll('${' + variableKey + '}', variableValue);
	}, value);
};
