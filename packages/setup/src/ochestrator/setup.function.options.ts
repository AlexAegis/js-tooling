import { normalizeCwdOption, type CwdOption, type NormalizedCwdOption } from '@alexaegis/fs';
import {
	normalizeLoggerOption,
	type LoggerOption,
	type NormalizedLoggerOption,
} from '@alexaegis/logging';

export type SetupOptions = CwdOption & LoggerOption;
export type NormalizedSetupOptions = NormalizedCwdOption & NormalizedLoggerOption;

export const normalizeSetupOptions = (options?: SetupOptions): NormalizedSetupOptions => {
	return {
		...normalizeCwdOption(options),
		...normalizeLoggerOption(options),
	};
};
