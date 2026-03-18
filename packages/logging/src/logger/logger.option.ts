import type { Logger } from 'tslog';
import { noopLogger } from './noop-logger.const.js';

export interface LoggerOption<LogObj = unknown> {
	/**
	 * An optional Logger target.
	 *
	 * @defaultValue undefined
	 */
	logger?: Logger<LogObj>;
}

export type NormalizedLoggerOption<LogObj = unknown> = Required<LoggerOption<LogObj>>;

export const normalizeLoggerOption = <LogObj = unknown>(
	options?: LoggerOption<LogObj>,
): NormalizedLoggerOption<LogObj> => {
	return {
		logger: options?.logger ?? (noopLogger as Logger<LogObj>),
	};
};
