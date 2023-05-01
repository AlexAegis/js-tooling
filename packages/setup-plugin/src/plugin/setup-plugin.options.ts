import { normalizeCwdOption, type CwdOption, type NormalizedCwdOption } from '@alexaegis/fs';
import {
	normalizeLoggerOption,
	type LoggerOption,
	type NormalizedLoggerOption,
} from '@alexaegis/logging';

export interface BaseSetupPluginOptions {
	workspaceRoot: string;
}

export type SetupPluginOptions = CwdOption & LoggerOption & BaseSetupPluginOptions;
export type NormalizedSetupPluginOptions = NormalizedCwdOption &
	NormalizedLoggerOption &
	Required<BaseSetupPluginOptions>;

export const normalizeSetupPluginOptions = (
	options: SetupPluginOptions
): NormalizedSetupPluginOptions => {
	return {
		...normalizeCwdOption(options),
		...normalizeLoggerOption(options),
		workspaceRoot: options.workspaceRoot,
	};
};
