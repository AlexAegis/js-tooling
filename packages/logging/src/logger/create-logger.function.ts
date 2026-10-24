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
	// tslog warns about unknown settings
	const { timestamps: _timestamps, ...settings } = normalizeLoggerOptions(options);

	// tslog warns on a minLevel outside its default levels and throws if strictConfig is set.
	// Sub-loggers inherit middleware, so a middleware that drops every log also silences them.
	if (settings.minLevel === LogLevel.OFF) {
		settings.minLevel = LogLevel.FATAL;
		settings.middleware = [() => false, ...(settings.middleware ?? [])];
	}

	return new Logger(settings);
};
