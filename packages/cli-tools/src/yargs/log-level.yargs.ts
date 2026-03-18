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
				const i = Number.parseInt(value, 10);
				if (!Number.isNaN(i) && isLogLevelEnumValue(i)) {
					return i;
				} else if (isLogLevelEnumKey(value)) {
					return LogLevel[value];
				} else {
					return LogLevel.INFO;
				}
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
		} else if (args.verbose) {
			return { logLevel: LogLevel.TRACE };
		} else {
			return undefined;
		}
	}) as MiddlewareFunction);
};
