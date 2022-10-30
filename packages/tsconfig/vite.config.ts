import { libraryViteConfig } from '@alexaegis/vite';
import { defineConfig, mergeConfig } from 'vite';

export default mergeConfig(
	libraryViteConfig,
	defineConfig({
		plugins: [],
	})
);
