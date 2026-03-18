import type { Defined } from '@alexaegis/common';
import { Logger, type ISettingsParam } from 'tslog';

export interface LoggerCustomOptions {
	/**
	 * @defaultValue false
	 */
	timestamps?: boolean;
}

export type LoggerOptions<L = unknown> = LoggerCustomOptions & ISettingsParam<L>;
export type NormalizedLoggerOptions<L = unknown> = Defined<LoggerCustomOptions> & ISettingsParam<L>;

export const prettyLogTemplateTimestamp = '{{dateIsoStr}}\t';
export const prettyLogTemplateBody = '{{logLevelName}}:{{nameWithDelimiterPrefix}}\t';

export const normalizeLoggerOptions = <L = unknown>(
	options?: LoggerOptions<L>,
): NormalizedLoggerOptions<L> => {
	const timestamps = options?.timestamps ?? false;

	return {
		name: 'log',
		timestamps,
		prettyLogTemplate: timestamps
			? prettyLogTemplateTimestamp + prettyLogTemplateBody
			: prettyLogTemplateBody,
		...options,
	} as NormalizedLoggerOptions<L>;
};

export const createLogger = <L = unknown>(options?: LoggerOptions<L>): Logger<L> => {
	return new Logger(normalizeLoggerOptions(options));
};
