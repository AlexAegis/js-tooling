import type { Config } from 'prettier';
import prettierPluginTailwindcss from 'prettier-plugin-tailwindcss';

export const prettierConfigTailwind = {
	plugins: [prettierPluginTailwindcss],
} as Config;

export default prettierConfigTailwind;
