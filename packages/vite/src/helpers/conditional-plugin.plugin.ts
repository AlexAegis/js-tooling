import type { Plugin, PluginOption } from 'vite';
import { disabledPlugin } from './disabled-plugin.plugin.js';

export const conditionalPlugin = (plugin: PluginOption, condition: () => boolean): PluginOption => {
	if (condition()) {
		return plugin;
	} else {
		let name = 'unknown';
		if (typeof plugin === 'object' && (plugin as Plugin).name) {
			name = (plugin as Plugin).name;
		}
		return disabledPlugin(name);
	}
};
