import type { UserConfig } from 'vite';
import { mergeConfig } from 'vite';
import { DEFAULT_VITE_CONFIG, DEFAULT_VITE_LIB_CONFIG } from './base-vite.config.js';

/**
 * Merges with DEFAULT_VITE_CONFIG
 *
 *
 */
export const defineAppConfig = (config: UserConfig) => mergeConfig(DEFAULT_VITE_CONFIG, config);

/**
 * TODO: redo with pakk in mind
 * @param config
 * @returns
 */
export const defineLibConfig = (config: UserConfig) => mergeConfig(DEFAULT_VITE_LIB_CONFIG, config);
