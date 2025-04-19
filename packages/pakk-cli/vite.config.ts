import { DEFAULT_VITE_LIB_CONFIG } from '@alexaegis/vite';
import { mergeConfig } from 'vite';
import { pakk } from 'vite-plugin-pakk';

export default mergeConfig(DEFAULT_VITE_LIB_CONFIG, {
	plugins: [
		pakk({
			developmentPackageJsonExportsTarget: 'source',
		}),
	],
	resolve: {
		alias: {
			'unicorn-magic': 'src/unicorn-magic.js',
		},
	},
});
