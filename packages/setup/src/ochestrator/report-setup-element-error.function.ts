import type { NormalizedLoggerOption } from '@alexaegis/logging';
import type { PackageSetupElementError } from './setup-errors.js';

export const reportSetupElementError = (
	error: PackageSetupElementError,
	options: NormalizedLoggerOption
): void => {
	const affectedPlugins = `Affected plugin${
		error.sourcePlugins.length > 1 ? 's' : ''
	}: ${error.sourcePlugins.map((p) => p.name).join(', ')}`;
	const affectedElements = `Affected element${
		error.sourceElements.length > 1 ? 's' : ''
	}: ${error.sourceElements.map((p) => p.name).join(', ')}`;

	options.logger.error(`Error: ${error.type}
	Reason: ${error.message}
	Target: ${error.target}
	${affectedPlugins}
	${affectedElements}
	Workspace: ${error.workspacePackage.packagePath}`);
};
