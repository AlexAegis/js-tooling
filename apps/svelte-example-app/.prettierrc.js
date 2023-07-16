// managed-by-autotool
import { mergeConfig, prettierConfig } from '@alexaegis/prettier-config';
import alexaegisPrettierConfigSvelte from '@alexaegis/prettier-config-svelte';
import alexaegisPrettierConfigTailwind from '@alexaegis/prettier-config-tailwind';

export default mergeConfig(
	prettierConfig,
	alexaegisPrettierConfigSvelte,
	alexaegisPrettierConfigTailwind,
);
