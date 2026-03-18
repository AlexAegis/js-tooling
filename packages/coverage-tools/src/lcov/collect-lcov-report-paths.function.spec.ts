import {
	PACKAGE_JSON_NAME,
	type CollectWorkspacePackagesOptions,
	type WorkspacePackage,
} from '@alexaegis/workspace-tools';
import { join } from 'node:path/posix';
import { afterAll, describe, expect, it, vi } from 'vitest';
import { mockProjectRoot } from '../../__mocks__/globby.js';
import { collectLcovReportPaths } from './collect-lcov-report-paths.function.js';

vi.mock('globby');

const cwdSpy = vi.spyOn(process, 'cwd').mockImplementation(() => mockProjectRoot);

vi.mock('@alexaegis/workspace-tools', async () => {
	const actualWorkspaceTools = await vi.importActual<typeof import('@alexaegis/workspace-tools')>(
		'@alexaegis/workspace-tools',
	);

	return {
		getWorkspaceRoot: vi.fn<() => string | undefined>(
			(options?: { cwd: string | undefined }) => {
				return (options?.cwd ?? mockProjectRoot).startsWith(mockProjectRoot)
					? mockProjectRoot
					: undefined;
			},
		),
		collectWorkspacePackages: vi.fn(
			(rawOptions?: CollectWorkspacePackagesOptions): WorkspacePackage[] => {
				expect(rawOptions?.skipWorkspaceRoot).toBeTruthy();

				const cwd = rawOptions?.cwd ?? process.cwd();

				return cwd.startsWith(mockProjectRoot)
					? [
							{
								packageKind: 'regular',
								packagePath: `${mockProjectRoot}/package/zed`,
								packageJsonPath: `${mockProjectRoot}/package/zed/${PACKAGE_JSON_NAME}`,
								packageJson: {},
								packagePathFromRootPackage: 'package/zed',
							},
							{
								packageKind: 'regular',
								packagePath: `${mockProjectRoot}/package/zod`,
								packageJsonPath: `${mockProjectRoot}/package/zod/${PACKAGE_JSON_NAME}`,
								packageJson: {},
								packagePathFromRootPackage: 'package/zod',
							},
							{
								packageKind: 'regular',
								packagePath: `${mockProjectRoot}/package/notest`,
								packageJsonPath: `${mockProjectRoot}/package/notest/${PACKAGE_JSON_NAME}`,
								packageJson: {},
								packagePathFromRootPackage: 'package/notest',
							},
						]
					: [];
			},
		),
		normalizeCollectWorkspacePackagesOptions:
			actualWorkspaceTools.normalizeCollectWorkspacePackagesOptions,
		NODE_MODULES_DIRECTORY_NAME: actualWorkspaceTools.NODE_MODULES_DIRECTORY_NAME,
		PACKAGE_JSON_NAME: actualWorkspaceTools.PACKAGE_JSON_NAME,
	};
});

describe('collectLcovReportPaths', () => {
	afterAll(() => {
		vi.resetAllMocks();
	});

	it('should return paths of all lcov reports in the workspace except at the root', async () => {
		expect(await collectLcovReportPaths()).toEqual([
			join(mockProjectRoot, 'packages/zed/coverage/lcov.info'),
			join(mockProjectRoot, 'packages/zod/coverage/lcov.info'),
		]);
	});

	it('should not find any outside of the project', async () => {
		cwdSpy.mockImplementationOnce(() => '/foo');

		expect(await collectLcovReportPaths()).toEqual([]);
	});
});
