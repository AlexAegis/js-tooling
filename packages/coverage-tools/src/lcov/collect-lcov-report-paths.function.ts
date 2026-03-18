import { isNullish } from '@alexaegis/common';
import {
	NODE_MODULES_DIRECTORY_NAME,
	collectWorkspacePackages,
	getWorkspaceRoot,
} from '@alexaegis/workspace-tools';
import { globby } from 'globby';
import {
	normalizeCollectLcovReportPathsOptions,
	type CollectLcovReportPathsOptions,
} from './collect-lcov-report-paths.function.options.js';

export const LCOV_INFO_FILE_NAME = 'lcov.info';

export const collectLcovReportPaths = async (
	rawOptions?: CollectLcovReportPathsOptions,
): Promise<string[]> => {
	const options = normalizeCollectLcovReportPathsOptions(rawOptions);
	const workspaceRoot = getWorkspaceRoot(options);

	if (isNullish(workspaceRoot)) {
		return [];
	}

	const workspacePackages = await collectWorkspacePackages({
		...options,
		skipWorkspaceRoot: true,
	});

	const lcovPathResults = await Promise.all(
		workspacePackages.map((workspacePackage) =>
			globby([`${workspacePackage.packagePath}/**/${LCOV_INFO_FILE_NAME}`], {
				absolute: true,
				onlyFiles: true,
				cwd: workspaceRoot,
				ignore: [`**/${NODE_MODULES_DIRECTORY_NAME}`],
			}),
		),
	);

	return lcovPathResults.flat();
};
