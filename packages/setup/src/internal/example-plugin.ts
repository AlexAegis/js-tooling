import type { SetupPlugin } from './setup-plugin.interface.js';

export const exampleSetupPlugin = (): SetupPlugin => {
	return {
		packageJsonFilter: {
			a: {},
			archetype: {
				framework: 'v',
				kind: 'a',
				language: 'a',
				disabledElements: (elements) => !(elements?.includes('asd') ?? false),
			},
		},
		elements: [
			{
				kind: 'file',
				sourceFile: '',
				targetFile: '',
			},
		],
	};
};
