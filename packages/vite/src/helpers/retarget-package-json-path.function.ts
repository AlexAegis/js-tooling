import type { PackageJsonTarget } from '../plugins/autolib.plugin.options.js';
import { enterPathPosix } from './enter-path.function.js';
import { offsetRelativePathPosix } from './offset-relative-path-posix.function.js';

export const retargetPackageJsonPath = (
	path: string,
	packageJsonTarget: PackageJsonTarget
): string => {
	let offsetPath = '';
	let enterCount = 0;
	switch (packageJsonTarget) {
		case 'source-to-build': {
			offsetPath = 'dist';
			enterCount = 1;
			break;
		}
		case 'build-to-build': {
			offsetPath = '';
			enterCount = 1;
			break;
		}
		case 'source-to-source': {
			offsetPath = '';
			enterCount = 0;
			break;
		}
	}
	const enteredPath = enterPathPosix(path, enterCount);
	return offsetRelativePathPosix(offsetPath, enteredPath);
};
