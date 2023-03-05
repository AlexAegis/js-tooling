import type { Config } from 'stylelint';

export default {
	extends: ['stylelint-config-standard'],
	ignoreFiles: ['coverage/**/*', 'node_modules/**/*', 'dist/**/*', '.turbo/**/*'],
} as Config;
