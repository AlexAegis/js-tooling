export enum LogLevel {
	OFF = 1_000_000,
	FATAL = 6,
	ERROR = 5,
	WARN = 4,
	INFO = 3,
	DEBUG = 2,
	TRACE = 1,
	SILLY = 0,
}

export type LogLevelKeys = keyof typeof LogLevel;

export const logLevelKeys = Object.values(LogLevel).filter(
	(valueOrKey) => typeof valueOrKey === 'string',
);

export const logLevelValues = Object.values(LogLevel).filter(
	(valueOrKey) => typeof valueOrKey === 'number',
);

export const isLogLevelEnumValue = (o: unknown): o is LogLevel => {
	return logLevelValues.includes(o as LogLevel);
};

export const isLogLevelEnumKey = (o: unknown): o is LogLevelKeys => {
	return logLevelKeys.includes(o as string);
};
