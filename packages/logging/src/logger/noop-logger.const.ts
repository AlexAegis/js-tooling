import { createLogger } from './create-logger.function.js';
import { LogLevel } from './log-level.enum.js';

/**
 * Acts as the default logger that does not do anything.
 */
export const noopLogger = createLogger({ type: 'hidden', minLevel: LogLevel.OFF });
