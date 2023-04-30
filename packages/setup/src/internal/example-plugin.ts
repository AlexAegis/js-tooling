import type { SetupPlugin } from './setup-plugin.interface.js';

export const exampleSetupPlugin = (): SetupPlugin => {
	return {
		packageJsonFilter: {
			archetype: {},
		},
		elements: [],
	};
};
