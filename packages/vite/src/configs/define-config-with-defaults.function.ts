import type { UserConfigExport } from 'vite';
import { defineConfig, mergeConfig } from 'vite';
import { DEFAULT_VITE_CONFIG, DEFAULT_VITE_LIB_CONFIG } from './base-vite.config.js';

/**
 * Adds defaults from DEFAULT_VITE_CONFIG
 */
export const defineAppConfig = (config: UserConfigExport) =>
	mergeConfig(DEFAULT_VITE_CONFIG, defineConfig(config));
/**
 * Adds defaults from DEFAULT_VITE_LIB_CONFIG, but no plugins
 *
 * Recommended plugins are:
 * - autolib
 * - dts
 */
export const defineLibConfig = (config: UserConfigExport) =>
	mergeConfig(DEFAULT_VITE_LIB_CONFIG, defineConfig(config));
