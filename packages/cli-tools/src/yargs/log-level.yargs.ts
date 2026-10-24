import type { NormalizedLogLevelOption } from '@alexaegis/logging';
import { isLogLevelEnumKey, isLogLevelEnumValue, LogLevel } from '@alexaegis/logging';
import type { Argv, MiddlewareFunction } from 'yargs';

export const yargsForLogLevelOption = <T>(yargs: Argv<T>): Argv<T & NormalizedLogLevelOption> => {
	const logLevelYargs = yargs
		.option('logLevel', {
			alias: 'll',
			choices: Object.values(LogLevel),
			description: 'Minimum logLevel',
			default: LogLevel.INFO,
			coerce: (value: string): LogLevel => {
				// eslint-disable-next-line unicorn/prefer-number-coercion -- Number('') is 0 (SILLY) where parseInt falls back to INFO
				const i = Number.parseInt(value, 10);
				if (!Number.isNaN(i) && isLogLevelEnumValue(i)) {
					return i;
				}
				return isLogLevelEnumKey(value) ? LogLevel[value] : LogLevel.INFO;
			},
		})
		.option('quiet', {
			alias: ['q', 'silent'],
			description: 'Turn off logging',
			boolean: true,
			conflicts: ['verbose'],
		})
		.option('verbose', {
			alias: 'v',
			description: 'Turn on (almost) all logging',
			boolean: true,
			conflicts: ['silent'],
		});
	// Middleware looks like is not typed well in @types/yargs
	return logLevelYargs.middleware(((args: Awaited<typeof logLevelYargs.argv>) => {
		if (args.quiet) {
			return { logLevel: LogLevel.OFF };
		}
		return args.verbose ? { logLevel: LogLevel.TRACE } : undefined;
	}) as MiddlewareFunction);
};
