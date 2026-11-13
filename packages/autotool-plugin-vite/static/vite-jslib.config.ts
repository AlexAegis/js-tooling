// managed-by-autotool
import { DEFAULT_VITE_JS_LIB_CONFIG } from '@alexaegis/vite';
import { defineConfig, mergeConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default mergeConfig(
	DEFAULT_VITE_JS_LIB_CONFIG,
	defineConfig({
		plugins: [
			...(process.env['BUILD_REASON'] === 'publish'
				? [
						dts({
							entryRoot: 'src',
							include: ['src'],
							exclude: [
								'src/**/*.{spec,test}.?(c|m)[jt]s?(x)',
								'src/**/__tests__/**',
								'src/**/__mocks__/**',
							],
						}),
					]
				: []),
		],
	}),
);
