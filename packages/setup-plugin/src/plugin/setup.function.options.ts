import { normalizeDryOption, type DryOption, type NormalizedDryOption } from '@alexaegis/common';
import { normalizeCwdOption, type CwdOption, type NormalizedCwdOption } from '@alexaegis/fs';
import {
	normalizeLoggerOption,
	type LoggerOption,
	type NormalizedLoggerOption,
} from '@alexaegis/logging';

export type SetupOptions = CwdOption & LoggerOption & DryOption;
export type NormalizedSetupOptions = NormalizedCwdOption &
	NormalizedLoggerOption &
	NormalizedDryOption;

export const normalizeSetupOptions = (options?: SetupOptions): NormalizedSetupOptions => {
	return {
		...normalizeCwdOption(options),
		...normalizeLoggerOption(options),
		...normalizeDryOption(options),
	};
};
