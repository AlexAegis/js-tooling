import { cyan, green, red, yellow } from 'kolorist';

export enum LogLevel {
	INFO = 'INFO',
	ERROR = 'ERROR',
}

export interface Logger {
	logLevel: LogLevel;
	log: (message: string) => void;
	error: (message: string) => void;
}

export interface CreateLoggerOptions {
	logLevel?: LogLevel;
	prefix: string;
}

export const createLogger = (options: CreateLoggerOptions): Logger => {
	const prefix = (message: string) => cyan(`[${options.prefix}] ${green(message)}`);
	const prefixError = (message: string) => red(`[${options.prefix}] ${yellow(message)}`);

	return {
		logLevel: options.logLevel ?? LogLevel.INFO,
		log: (message: string): void => console.log(prefix(message)),
		error: (message: string): void => console.log(prefixError(message)),
	};
};

export const noopLogger: Logger = {
	logLevel: LogLevel.ERROR,
	error: () => false,
	log: () => false,
};
