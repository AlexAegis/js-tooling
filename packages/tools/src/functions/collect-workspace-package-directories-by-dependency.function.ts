import { collectWorkspacePackageDirectoriesWithPackageJson } from './collect-workspace-package-directories.function';

export const collectWorkspacePageDirectoriesByDependency = (
	path: string,
	dependencies: string[]
): string[] => {
	const packages = collectWorkspacePackageDirectoriesWithPackageJson(path);
	return packages
		.filter((relativePackage) => {
			const packageDependencies = new Set([
				...Object.keys(relativePackage.packageJson.dependencies ?? {}),
				...Object.keys(relativePackage.packageJson.devDependencies ?? {}),
			]);

			return dependencies.some((dependency) => packageDependencies.has(dependency));
		})
		.map((relativePackage) => relativePackage.path);
};
