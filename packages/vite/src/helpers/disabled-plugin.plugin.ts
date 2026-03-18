import type { Plugin } from 'vite';

export const disabledPlugin = (disabledPluginName: string): Plugin => {
	const name = `disabled:${disabledPluginName}`;

	return {
		name,
		buildStart: () => {
			console.log(`[vite] Skipping plugin ${disabledPluginName}`);
		},
	};
};
