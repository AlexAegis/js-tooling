// managed-by-autotool
import { DEFAULT_VITE_JS_LIB_CONFIG, pakk } from '@alexaegis/vite';
import { mergeConfig } from 'vite';

export default mergeConfig(DEFAULT_VITE_JS_LIB_CONFIG, {
	plugins: [
		pakk({
			developmentPackageJsonExportsTarget: 'source',
			dts: process.env['BUILD_REASON'] === 'publish',
		}),
	],
});
