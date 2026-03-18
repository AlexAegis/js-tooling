import { normalizeDryOption, type DryOption } from '@alexaegis/common';
import { normalizeLoggerOption, type LoggerOption } from '@alexaegis/logging';
import type { BuiltInParserName } from 'prettier';
import { normalizeCwdOption, type CwdOption } from '../functions/cwd.option.js';

export interface PrettifyOptions extends CwdOption, LoggerOption, DryOption {
	/**
	 * Which prettier parser is used
	 *
	 * @defaultValue 'babel'
	 */
	parser?: BuiltInParserName;
}

export type NormalizedPrettifyOptions = Required<PrettifyOptions>;

export const normalizePrettifyOptions = (options?: PrettifyOptions): NormalizedPrettifyOptions => {
	return {
		...normalizeCwdOption(options),
		...normalizeLoggerOption(options),
		...normalizeDryOption(options),
		parser: options?.parser ?? 'babel',
	};
};
