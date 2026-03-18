import {
	normalizeLoggerOption,
	type LoggerOption,
	type NormalizedLoggerOption,
} from '@alexaegis/logging';
import { normalizeCwdOption, type CwdOption, type NormalizedCwdOption } from './cwd.option.js';

export type TurnIntoExecutableOptions = CwdOption & LoggerOption;
export type NormalizedTurnIntoExecutableOptions = NormalizedCwdOption & NormalizedLoggerOption;

export const normalizeTurnIntoExecutableOptions = (
	options?: TurnIntoExecutableOptions,
): NormalizedTurnIntoExecutableOptions => {
	return {
		...normalizeCwdOption(options),
		...normalizeLoggerOption(options),
	};
};
