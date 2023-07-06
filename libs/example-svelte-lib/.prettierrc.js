// managed-by-autotool
/** @type {typeof import('@alexaegis/prettier-config')} */
import { mergeConfig, prettierConfig } from '@alexaegis/prettier-config';
import alexaegisPrettierConfigSvelte from '@alexaegis/prettier-config-svelte';

/** @type {import('prettier').Config} */
export default mergeConfig(prettierConfig, alexaegisPrettierConfigSvelte);
