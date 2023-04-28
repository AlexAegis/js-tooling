import { createLogger } from '@alexaegis/logging';
import type { Plugin } from 'vite';

export const disabledPlugin = (disabledPluginName: string): Plugin => {
	const name = `disabled:${disabledPluginName}`;
	const logger = createLogger({
		name: `vite:${name}`,
	});

	return {
		name,
		buildStart: () => {
			logger.info(`Skipping plugin ${disabledPluginName}`);
		},
	};
};
