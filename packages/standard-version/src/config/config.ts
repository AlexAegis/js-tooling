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
				filename: join(workspacePackage.path, 'package.json'),
				updater,
			},
			{
				filename: join(workspacePackage.path, 'readme.md'),
				updater,
			},
			...subPackages.map((p) => ({
				filename: join(p.path, 'package.json'),
				updater,
			})),
			...subPackages.map((p) => ({
				filename: join(p.path, 'readme.md'),
				updater,
			})),
		],
	};
};
