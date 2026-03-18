import {
	normalizeCollectWorkspacePackagesOptions,
	type CollectWorkspacePackagesOptions,
	type NormalizedCollectWorkspacePackagesOptions,
} from '@alexaegis/workspace-tools';

export type CollectLcovReportPathsOptions = Omit<
	CollectWorkspacePackagesOptions,
	'onlyWorkspaceRoot' | 'skipWorkspaceRoot'
>;

export type NormalizedCollectLcovReportPathsOptions = Omit<
	NormalizedCollectWorkspacePackagesOptions,
	'onlyWorkspaceRoot' | 'skipWorkspaceRoot'
>;

export const normalizeCollectLcovReportPathsOptions = (
	options?: CollectLcovReportPathsOptions,
): NormalizedCollectLcovReportPathsOptions => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { onlyWorkspaceRoot, skipWorkspaceRoot, ...rest } =
		normalizeCollectWorkspacePackagesOptions(options);

	return rest;
};
