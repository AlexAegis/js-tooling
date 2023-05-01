import { join } from 'node:path';
import { collectPackages } from '../workspace/collect-packages.js';
import { createUpdater } from '../workspace/local-package-updater.js';

export const createStandardVersionConfig = () => {
	const { workspacePackage, subPackages } = collectPackages();
	const updater = createUpdater(subPackages);
	return {
		scripts: {
			postbump: 'pnpm install',
			prechangelog: 'git add pnpm-lock.yaml',
		},
		bumpFiles: [
			{
				filename: workspacePackage.packageJsonPath,
				updater,
			},
			{
				filename: join(workspacePackage.packagePath, 'readme.md'),
				updater,
			},
			...subPackages.map((pkg) => ({
				filename: join(pkg.packagePath, 'package.json'),
				updater,
			})),
			...subPackages.map((pkg) => ({
				filename: join(pkg.packagePath, 'readme.md'),
				updater,
			})),
		],
	};
};
