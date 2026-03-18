import type { PackageJson } from './package-json.interface.js';

export type PackageJsonTemplateVariableNames =
	| 'packageName'
	| 'packageOrg'
	| 'packageNameWithoutOrg';

export type PackageJsonTemplateVariables = Record<PackageJsonTemplateVariableNames, string>;

export const getPackageJsonTemplateVariables = (
	packageJson: PackageJson,
): PackageJsonTemplateVariables & Record<string, string> => {
	const packageName = packageJson.name ?? '';
	let packageOrg: string | undefined;
	let packageNameWithoutOrg: string = packageName;
	if (packageName.includes('/')) {
		const [splitPackageOrg, ...splitPackageName] = packageName.split('/');
		packageOrg = splitPackageOrg;
		packageNameWithoutOrg = splitPackageName.join('/');
	}

	return {
		packageOrg: packageOrg ?? '',
		packageName,
		packageNameWithoutOrg,
	};
};
