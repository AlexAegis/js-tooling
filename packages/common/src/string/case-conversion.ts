import { capitalize } from './capitalize.function.js';

/**
 * Splits a string apart into it's individial words. It treats ' ', '_' and '-'
 * as word boundaries as well as when a lower case character is followed by an
 * upper case character.
 *
 * An empty string will result in an empty array.
 */
export const splitByCasing = (input: string): string[] => {
	return input ? input.split(/(?=[A-Z][a-z])|[\s_-]+/).map((word) => word.toLowerCase()) : [];
};

/**
 * Turns an input string to camelCase from any input casing
 */
export function camelCase(input: string): string {
	const [first, ...rest] = splitByCasing(input);
	return (first ?? '') + rest.map(capitalize).join('');
}

/**
 * Turns an input string to kebab-case from any input casing
 */
export function kebabCase(input: string): string {
	return splitByCasing(input).join('-');
}

/**
 * Turns an input string to snake_case from any input casing
 */
export function snakeCase(input: string): string {
	return splitByCasing(input).join('_');
}

/**
 * Turns an input string to UPPER_SNAKE_CASE from any input casing
 */
export function upperSnakeCase(input: string): string {
	return splitByCasing(input).join('_').toUpperCase();
}

/**
 * Turns an input string to PascalCase from any input casing
 */
export function pascalCase(input: string): string {
	return splitByCasing(input).map(capitalize).join('');
}

/**
 * Turns an input string to Train-Case from any input casing
 */
export function trainCase(input: string): string {
	return splitByCasing(input).map(capitalize).join('-');
}
