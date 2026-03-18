import { normalizeCwdOption, type CwdOption, type NormalizedCwdOption } from '@alexaegis/fs';
import {
	normalizeLoggerOption,
	type LoggerOption,
	type NormalizedLoggerOption,
} from '@alexaegis/logging';

export type GetRootPackageJsonOptions = CwdOption & LoggerOption;

export type NormalizedGetRootPackageJsonOptions = NormalizedCwdOption & NormalizedLoggerOption;

export const normalizeGetRootPackageJsonOptions = (
	options?: GetRootPackageJsonOptions,
): NormalizedGetRootPackageJsonOptions => {
	return {
		...normalizeCwdOption(options),
		...normalizeLoggerOption(options),
	};
};
