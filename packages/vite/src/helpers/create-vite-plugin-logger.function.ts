import { cyan, green, red, yellow } from 'kolorist';

export interface Logger {
	log: (message: string) => void;
	error: (message: string) => void;
}
export const createVitePluginLogger = (options: { pluginName: string }): Logger => {
	const prefix = (message: string) => cyan(`[vite:${options.pluginName}] ${green(message)}`);
	const prefixError = (message: string) => red(`[vite:${options.pluginName}] ${yellow(message)}`);

	return {
		log: (message: string): void => console.log(prefix(message)),
		error: (message: string): void => console.log(prefixError(message)),
	};
};

export const noopLogger: Logger = {
	error: () => false,
	log: () => false,
};
