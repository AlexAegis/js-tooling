import type { Defined } from '@alexaegis/common';
import { Logger, type ISettingsParam } from 'tslog';
import { LogLevel } from './log-level.enum.js';

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
		...options,
		timestamps,
		pretty: {
			template: timestamps
				? prettyLogTemplateTimestamp + prettyLogTemplateBody
				: prettyLogTemplateBody,
			...options?.pretty,
		},
	};
};

export const createLogger = <L = unknown>(options?: LoggerOptions<L>): Logger<L> => {
	// tslog warns about every setting that it does not know
	const { timestamps: _timestamps, ...settings } = normalizeLoggerOptions(options);

	// A minLevel outside of the default levels makes tslog warn, or throw with
	// strictConfig, in the logger and in each of its sub-loggers. Sub-loggers
	// inherit middleware, so a middleware that drops every log keeps them off.
	if (settings.minLevel === LogLevel.OFF) {
		settings.minLevel = LogLevel.FATAL;
		settings.middleware = [() => null, ...(settings.middleware ?? [])];
	}

	return new Logger(settings);
};
