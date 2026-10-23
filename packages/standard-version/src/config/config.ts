import { join } from 'node:path';
import { collectPackages } from '../workspace/collect-packages.js';
import { createGenericUpdater } from '../workspace/generic-updater.js';
import { createPackageJsonUpdater } from '../workspace/package-json-updater.js';
import { resolveChangelogPreset } from './resolve-changelog-preset.js';

export const createStandardVersionConfig = () => {
	const { workspacePackage, subPackages } = collectPackages();
	const packageJsonUpdater = createPackageJsonUpdater(subPackages);
	const genericUpdater = createGenericUpdater(subPackages);
	const changelogPreset = resolveChangelogPreset(workspacePackage.packagePath);

	return {
		// commit-and-tag-version then ignores preset options such as `types`
		// from package.json or the command line
		...(changelogPreset ? { preset: changelogPreset } : {}),
		scripts: {
			postbump: 'pnpm install',
			prechangelog: 'git add pnpm-lock.yaml',
		},
		bumpFiles: [
			{
				filename: workspacePackage.packageJsonPath,
				updater: packageJsonUpdater,
			},
			{
				filename: join(workspacePackage.packagePath, 'readme.md'),
				updater: genericUpdater,
			},
			...subPackages.map((pkg) => ({
				filename: pkg.packageJsonPath,
				updater: packageJsonUpdater,
			})),
			...subPackages.map((pkg) => ({
				filename: join(pkg.packagePath, 'readme.md'),
				updater: genericUpdater,
			})),
		],
	};
};
