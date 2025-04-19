import { defineConfig } from 'vite';
import { pakk } from 'vite-plugin-pakk';

export default defineConfig({
	plugins: [
		pakk({
			enabledFeatures: ['export', 'bin', 'copy-license', 'export-static', 'sort'],
			srcDir: 'source',
			binBaseDir: 'cli',
			bins: '**/*',
			binIgnore: ['ignore'],
			staticExports: ['static'],
			dts: true,
			logLevel: 1,
		}),
	],
});
