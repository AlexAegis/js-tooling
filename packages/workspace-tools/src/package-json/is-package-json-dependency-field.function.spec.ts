import { describe, expect, it } from 'vitest';
import { isPackageJsonDependencyField } from './is-package-json-dependency-field.function.js';
import { PACKAGE_JSON_DEPENDENCY_FIELDS } from './package-json.interface.js';

describe('isPackageJsonDependencyField', () => {
	it('should return true for every dependency field', () => {
		for (const dependencyFieldName of PACKAGE_JSON_DEPENDENCY_FIELDS) {
			expect(isPackageJsonDependencyField(dependencyFieldName)).toBeTruthy();
		}
	});

	it('should return false for non dependency field srings', () => {
		expect(isPackageJsonDependencyField('foo')).toBeFalsy();
		expect(isPackageJsonDependencyField(undefined)).toBeFalsy();
	});
});
