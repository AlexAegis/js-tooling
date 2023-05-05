import { normalizeDryOption, type DryOption, type NormalizedDryOption } from '@alexaegis/common';
import { normalizeCwdOption, type CwdOption, type NormalizedCwdOption } from '@alexaegis/fs';
import {
	normalizeLoggerOption,
	type LoggerOption,
	type NormalizedLoggerOption,
} from '@alexaegis/logging';

interface BaseSetupOptions {
	dryish?: boolean;
}

export type SetupOptions = BaseSetupOptions & CwdOption & LoggerOption & DryOption;
export type NormalizedSetupOptions = Required<BaseSetupOptions> &
	NormalizedCwdOption &
	NormalizedLoggerOption &
	NormalizedDryOption;

export const normalizeSetupOptions = (options?: SetupOptions): NormalizedSetupOptions => {
	return {
		...normalizeCwdOption(options),
		...normalizeLoggerOption(options),
		...normalizeDryOption(options),
		dryish: options?.dryish ?? false,
	};
};
