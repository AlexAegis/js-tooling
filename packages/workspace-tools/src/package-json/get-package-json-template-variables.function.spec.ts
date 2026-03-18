import { describe, expect, it } from 'vitest';
import {
	getPackageJsonTemplateVariables,
	type PackageJsonTemplateVariables,
} from './get-package-json-template-variables.function.js';
import type { PackageJson } from './package-json.interface.js';

describe('getPackageJsonTemplateVariables', () => {
	it('should retreive the template variables from a packageJson object where the name has an org', () => {
		const packageJson: PackageJson = {
			name: '@org/name',
		};

		const expectedVariables: PackageJsonTemplateVariables = {
			packageName: '@org/name',
			packageNameWithoutOrg: 'name',
			packageOrg: '@org',
		};

		const templateVariables = getPackageJsonTemplateVariables(packageJson);

		expect(templateVariables).toEqual(expectedVariables);
	});

	it('should retreive the template variables from a packageJson object where the name does not have an org', () => {
		const packageJson: PackageJson = {
			name: 'name',
		};

		const expectedVariables: PackageJsonTemplateVariables = {
			packageName: 'name',
			packageNameWithoutOrg: 'name',
			packageOrg: '',
		};

		const templateVariables = getPackageJsonTemplateVariables(packageJson);

		expect(templateVariables).toEqual(expectedVariables);
	});

	it('should retreive the template variables from a packageJson object where there is no name', () => {
		const packageJson: PackageJson = {};

		const expectedVariables: PackageJsonTemplateVariables = {
			packageName: '',
			packageNameWithoutOrg: '',
			packageOrg: '',
		};

		const templateVariables = getPackageJsonTemplateVariables(packageJson);

		expect(templateVariables).toEqual(expectedVariables);
	});
});
