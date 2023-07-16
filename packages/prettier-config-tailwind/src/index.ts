import type { Config } from 'prettier';
// ? Can't use the import until this is solved https://github.com/remcohaszing/unified-prettier/issues/1
// import prettierPluginTailwindcss from 'prettier-plugin-tailwindcss';

export const prettierConfigTailwind = {
	plugins: ['prettier-plugin-tailwindcss'],
} as Config;

export default prettierConfigTailwind;
