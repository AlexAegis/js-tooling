import {
	PACKAGE_JSON_DEPENDENCY_FIELDS,
	type PackageJson,
	type RegularWorkspacePackage,
	type WorkspacePackage,
} from '@alexaegis/workspace-tools';

import { mapObject } from '@alexaegis/common';
import type { NormalizedPakkContext } from '../../index.js';
import { PACKAGE_JSON_KIND, type PackageJsonKindType } from '../../package-json/index.js';
import type { PakkFeature } from '../pakk-feature.type.js';

const removeWorkspaceVersionDirective = (
	version: string,
	pkg: WorkspacePackage | undefined,
): string => {
	const result = version.replace(/^workspace:/, '');

	return pkg?.packageJson.version && (result.length === 0 || result === '^' || result === '~')
		? result + pkg.packageJson.version
		: result;
};

/**
 * Removes the workspace: dependency specifier
 */
export class AutoRemoveWorkspaceDirective implements PakkFeature {
	public readonly order = 6;

	private readonly context: NormalizedPakkContext;

	constructor(context: NormalizedPakkContext) {
		this.context = context;
	}

	postprocess(
		workspacePackage: RegularWorkspacePackage,
		packageJsonKind: PackageJsonKindType,
	): PackageJson {
		if (packageJsonKind === PACKAGE_JSON_KIND.DISTRIBUTION) {
			this.context.logger.info('removing the workspace: specifier from dependencies...');

			return PACKAGE_JSON_DEPENDENCY_FIELDS.reduce(
				(packageJson, dependencyField) => {
					const dependencies = packageJson[dependencyField];
					if (dependencies) {
						packageJson[dependencyField] = mapObject(dependencies, (value, key) =>
							value
								? removeWorkspaceVersionDirective(
										value,
										this.context.allWorkspacePackages.find(
											(pkg) => pkg.packageJson.name === key,
										),
									)
								: value,
						);
					}

					return packageJson;
				},
				{ ...workspacePackage.packageJson },
			);
		} else {
			return workspacePackage.packageJson;
		}
	}
}
