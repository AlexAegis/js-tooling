import { describe, expect, it } from 'vitest';
import {
	camelCase,
	kebabCase,
	pascalCase,
	snakeCase,
	splitByCasing,
	trainCase,
	upperSnakeCase,
} from './case-conversion.js';

describe('case conversions', () => {
	describe('splitByCasing', () => {
		describe('should split up any casing into its individual, lowercase components', () => {
			const expected = ['some', 'example', 'string'];

			it('should be able to split camelCase', () => {
				expect(splitByCasing('someExampleString')).toEqual(expected);
			});

			it('should be able to split kebab-case', () => {
				expect(splitByCasing('some-example-string')).toEqual(expected);
			});

			it('should be able to split snake_case', () => {
				expect(splitByCasing('some_example_string')).toEqual(expected);
			});

			it('should be able to split UPPER_SNAKE_CASE', () => {
				expect(splitByCasing('SOME_EXAMPLE_STRING')).toEqual(expected);
			});

			it('should be able to split PascalCase', () => {
				expect(splitByCasing('SomeExampleString')).toEqual(expected);
			});

			it('should be able to split a regular sentence', () => {
				expect(splitByCasing('Some example string')).toEqual(expected);
			});

			it('should return an empty array for an empty string', () => {
				expect(splitByCasing('')).toEqual([]);
			});

			describe('stacked separators when splitting', () => {
				it('should be able to split stacked kebab-case', () => {
					expect(splitByCasing('some----example-string')).toEqual(expected);
				});

				it('should be able to split stacked snake_case', () => {
					expect(splitByCasing('some___example_string')).toEqual(expected);
				});

				it('should be able to split stacked UPPER_SNAKE_CASE', () => {
					expect(splitByCasing('SOME_EXAMPLE_____STRING')).toEqual(expected);
				});

				it('should be able to split a stacked regular sentence', () => {
					expect(splitByCasing('Some example      string')).toEqual(expected);
				});

				it('should be able to split a string with mixed boundaries', () => {
					expect(splitByCasing('SomeExample - __ -      string')).toEqual(expected);
				});
			});
		});
	});

	describe('camelCase conversion', () => {
		it('should convert kebab-case to camelCase', () => {
			expect(camelCase('some-example-string')).toBe('someExampleString');
		});

		it('should convert snake_case to camelCase', () => {
			expect(camelCase('some_example_string')).toBe('someExampleString');
		});

		it('should convert UPPER_SNAKE_CASE to camelCase', () => {
			expect(camelCase('SOME_UPPER_CASE_STRING')).toBe('someUpperCaseString');
		});

		it('should convert PascalCase to camelCase', () => {
			expect(camelCase('SomePascalCaseString')).toBe('somePascalCaseString');
		});

		it('should convert a regular sentence to camelCase', () => {
			expect(camelCase('This is a test sentence')).toBe('thisIsATestSentence');
		});

		it('should keep camelCase as camelCase', () => {
			expect(camelCase('someExampleString')).toBe('someExampleString');
		});

		it('should return an empty string for an empty string', () => {
			expect(camelCase('')).toBe('');
		});
	});

	describe('kebab-case conversion', () => {
		it('should convert camelCase to kebab-case', () => {
			expect(kebabCase('someExampleString')).toBe('some-example-string');
		});

		it('should convert snake_case to kebab-case', () => {
			expect(kebabCase('some_example_string')).toBe('some-example-string');
		});

		it('should convert UPPER_SNAKE_CASE to kebab-case', () => {
			expect(kebabCase('SOME_UPPER_CASE_STRING')).toBe('some-upper-case-string');
		});

		it('should convert PascalCase to kebab-case', () => {
			expect(kebabCase('SomePascalCaseString')).toBe('some-pascal-case-string');
		});

		it('should convert a regular sentence to kebab-case', () => {
			expect(kebabCase('This is a test sentence')).toBe('this-is-a-test-sentence');
		});

		it('should return an empty string for an empty string', () => {
			expect(kebabCase('')).toBe('');
		});
	});

	describe('snake_case conversion', () => {
		it('should convert camelCase to snake_case', () => {
			expect(snakeCase('someExampleString')).toBe('some_example_string');
		});

		it('should convert kebab-case to snake_case', () => {
			expect(snakeCase('some-example-string')).toBe('some_example_string');
		});

		it('should convert UPPER_SNAKE_CASE to snake_case', () => {
			expect(snakeCase('SOME_UPPER_CASE_STRING')).toBe('some_upper_case_string');
		});

		it('should convert PascalCase to snake_case', () => {
			expect(snakeCase('SomePascalCaseString')).toBe('some_pascal_case_string');
		});

		it('should convert a regular sentence to snake_case', () => {
			expect(snakeCase('This is a test sentence')).toBe('this_is_a_test_sentence');
		});

		it('should return an empty string for an empty string', () => {
			expect(snakeCase('')).toBe('');
		});
	});

	describe('UPPER_SNAKE_CASE conversion', () => {
		it('should convert camelCase to UPPER_SNAKE_CASE', () => {
			expect(upperSnakeCase('someExampleString')).toBe('SOME_EXAMPLE_STRING');
		});

		it('should convert kebab-case to UPPER_SNAKE_CASE', () => {
			expect(upperSnakeCase('some-example-string')).toBe('SOME_EXAMPLE_STRING');
		});

		it('should convert snake_case to UPPER_SNAKE_CASE', () => {
			expect(upperSnakeCase('some_example_string')).toBe('SOME_EXAMPLE_STRING');
		});

		it('should convert PascalCase to UPPER_SNAKE_CASE', () => {
			expect(upperSnakeCase('SomePascalCaseString')).toBe('SOME_PASCAL_CASE_STRING');
		});

		it('should convert a regular sentence to UPPER_SNAKE_CASE', () => {
			expect(upperSnakeCase('This is a test sentence')).toBe('THIS_IS_A_TEST_SENTENCE');
		});

		it('should return an empty string for an empty string', () => {
			expect(upperSnakeCase('')).toBe('');
		});
	});

	describe('PascalCase conversion', () => {
		it('should convert camelCase to PascalCase', () => {
			expect(pascalCase('someExampleString')).toBe('SomeExampleString');
		});

		it('should convert kebab-case to PascalCase', () => {
			expect(pascalCase('some-example-string')).toBe('SomeExampleString');
		});

		it('should convert snake_case to PascalCase', () => {
			expect(pascalCase('some_example_string')).toBe('SomeExampleString');
		});

		it('should convert UPPER_SNAKE_CASE to PascalCase', () => {
			expect(pascalCase('SOME_UPPER_CASE_STRING')).toBe('SomeUpperCaseString');
		});

		it('should convert a regular sentence to PascalCase', () => {
			expect(pascalCase('This is a test sentence')).toBe('ThisIsATestSentence');
		});

		it('should return an empty string for an empty string', () => {
			expect(pascalCase('')).toBe('');
		});
	});

	describe('Train-Case conversions', () => {
		it('should convert camelCase to Train-Case', () => {
			expect(trainCase('someExampleString')).toBe('Some-Example-String');
		});

		it('should convert kebab-case to Train-Case', () => {
			expect(trainCase('some-example-string')).toBe('Some-Example-String');
		});

		it('should convert snake_case to Train-Case', () => {
			expect(trainCase('some_example_string')).toBe('Some-Example-String');
		});

		it('should convert UPPER_SNAKE_CASE to Train-Case', () => {
			expect(trainCase('SOME_UPPER_CASE_STRING')).toBe('Some-Upper-Case-String');
		});

		it('should convert PascalCase to Train-Case', () => {
			expect(trainCase('SomePascalCaseString')).toBe('Some-Pascal-Case-String');
		});

		it('should convert a regular sentence to Train-Case', () => {
			expect(trainCase('this is a test sentence')).toBe('This-Is-A-Test-Sentence');
		});

		it('should convert a mix of different casings to Train-Case', () => {
			expect(trainCase('mixed_Camel-kebab_snakeCase')).toBe('Mixed-Camel-Kebab-Snake-Case');
		});

		it('should return an empty string for an empty string', () => {
			expect(trainCase('')).toBe('');
		});
	});
});
