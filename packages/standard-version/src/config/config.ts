import { join } from 'node:path';
import { collectPackages } from '../workspace/collect-packages.js';
import { createGenericUpdater } from '../workspace/generic-updater.js';
import { createPackageJsonUpdater } from '../workspace/package-json-updater.js';

export const createStandardVersionConfig = () => {
	const { workspacePackage, subPackages } = collectPackages();
	const packageJsonUpdater = createPackageJsonUpdater(subPackages);
	const genericUpdater = createGenericUpdater(subPackages);

	return {
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
