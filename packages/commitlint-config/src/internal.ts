import { collectPackages } from '@alexaegis/standard-version';
import type { UserConfig } from '@commitlint/types';

const getPackageJsonNameWithoutOrg = (packageName = ''): string => {
	let packageNameWithoutOrg: string = packageName;
	if (packageName.includes('/')) {
		const [, ...splitPackageName] = packageName.split('/');
		packageNameWithoutOrg = splitPackageName.join('/');
	}
	return packageNameWithoutOrg;
};

export const getLocalPackageNamesWithoutOrg = (): string[] => {
	return collectPackages().subPackages.map((p) =>
		getPackageJsonNameWithoutOrg(p.packageJson.name)
	);
};

export const createCommitlintConfig = (): UserConfig => {
	const genericScopes = ['docs', 'lint', 'changelog', 'release'];
	const localPackageNames = getLocalPackageNamesWithoutOrg();

	return {
		extends: ['@commitlint/config-conventional'],
		type: ['feat', 'fix', 'test', 'docs', 'refactor', 'build', 'ci', 'perf', 'revert', 'style'],
		rules: {
			'scope-enum': [2, 'always', [...genericScopes, ...localPackageNames]],
		},
	};
};
