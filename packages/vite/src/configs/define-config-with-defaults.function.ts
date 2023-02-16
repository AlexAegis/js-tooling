import type { UserConfigExport } from 'vite';
import { defineConfig, mergeConfig } from 'vite';
import { DEFAULT_VITE_CONFIG } from './base-vite.config.js';

export const defineConfigWithDefaults = (config: UserConfigExport) =>
	mergeConfig(DEFAULT_VITE_CONFIG, defineConfig(config));
