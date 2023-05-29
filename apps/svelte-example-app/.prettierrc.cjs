// managed-by-autotool

/**
 * @type {typeof import('@alexaegis/prettier-config')}
 */
const { mergeConfig, prettierConfig } = require('@alexaegis/prettier-config');

module.exports = mergeConfig(
	prettierConfig,
	require('@alexaegis/prettier-config-svelte').default,
	require('@alexaegis/prettier-config-tailwind').default
);
