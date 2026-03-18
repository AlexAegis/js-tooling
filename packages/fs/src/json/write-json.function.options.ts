import { normalizeDryOption, type DryOption } from '@alexaegis/common';
import { normalizeLoggerOption, type LoggerOption } from '@alexaegis/logging';
import { normalizeCwdOption, type CwdOption } from '../index.js';

export interface WriteJsonOptions extends DryOption, LoggerOption, CwdOption {
	/**
	 * Formats the json file using prettier and your configuration.
	 *
	 * Disable if you don't have prettier
	 *
	 * @defaultValue true
	 */
	autoPrettier?: boolean;
}

export type NormalizedWriteJsonOptions = Required<WriteJsonOptions>;

export const normalizeWriteJsonOptions = (
	options?: WriteJsonOptions,
): NormalizedWriteJsonOptions => {
	return {
		...normalizeDryOption(options),
		...normalizeLoggerOption(options),
		...normalizeCwdOption(options),
		autoPrettier: options?.autoPrettier ?? true,
	};
};
