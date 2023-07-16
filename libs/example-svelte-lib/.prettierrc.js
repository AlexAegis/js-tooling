// managed-by-autotool
import { mergeConfig, prettierConfig } from '@alexaegis/prettier-config';
import alexaegisPrettierConfigSvelte from '@alexaegis/prettier-config-svelte';

export default mergeConfig(prettierConfig, alexaegisPrettierConfigSvelte);
