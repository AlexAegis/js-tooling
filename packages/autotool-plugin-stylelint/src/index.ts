import {
	type AutotoolPlugin,
	type AutotoolPluginObject,
	type PackageJsonFilter,
} from 'autotool-plugin';
import { join } from 'node:path';
import packageJson from '../package.json';

export const plugin: AutotoolPlugin = (_options): AutotoolPluginObject => {
	const packageJsonFilter: PackageJsonFilter = {
		archetype: {
			platform: 'web',
		},
	};

	return {
		name: packageJson.name,
		elements: [
			{
				description: 'package stylelint config file',
				executor: 'fileCopy',
				packageKind: 'regular',
				packageJsonFilter,
				formatWithPrettier: true,
				sourceFile: join('static', 'stylelint.config.js'),
				targetFile: '.stylelintrc.mjs',
				sourcePluginPackageName: packageJson.name,
			},
			{
				description: 'package stylelintignore file',
				executor: 'fileCopy',
				packageKind: 'regular',
				packageJsonFilter,
				sourceFile: join('static', 'stylelintignore'),
				targetFile: '.stylelintignore',
				sourcePluginPackageName: packageJson.name,
			},
			{
				description: 'workspace stylelint scripts and devDependencies',
				executor: 'packageJson',
				packageKind: 'root',
				data: {
					scripts: {
						'lint:style':
							'turbo run lint:style_ --concurrency 16 --cache-dir .cache/turbo',
						'lint:style:css':
							'turbo run lint:style:css_ --concurrency 16 --cache-dir .cache/turbo',
						'lint:style:scss':
							'turbo run lint:style:scss_ --concurrency 16 --cache-dir .cache/turbo',
						'lint:style:html':
							'turbo run lint:style:html_ --concurrency 16 --cache-dir .cache/turbo',
					},
					devDependencies: {
						'@alexaegis/stylelint-config': `^${packageJson.version}`,
						stylelint: packageJson.devDependencies.stylelint,
					},
				},
			},
			{
				description: 'package stylelint scripts and devDependencies',
				executor: 'packageJson',
				packageKind: 'regular',
				packageJsonFilter,
				data: {
					scripts: {
						'lint:style':
							'turbo run lint:style_ --concurrency 16 --cache-dir .cache/turbo --filter ${packageName}',
						'lint:style:css':
							'turbo run lint:style:css_ --concurrency 16 --cache-dir .cache/turbo --filter ${packageName}',
						'lint:style:css_':
							"stylelint --cache true --cache-strategy content --cache-location .cache/stylelintcache-css --allow-empty-input '**/*.css'",
						'lint:style:scss':
							'turbo run lint:style:scss_ --concurrency 16 --cache-dir .cache/turbo --filter ${packageName}',
						'lint:style:scss_':
							"stylelint --customSyntax=postcss-scss --cache true --cache-strategy content --cache-location .cache/stylelintcache-scss --allow-empty-input '**/*.scss'",
						'lint:style:html':
							'turbo run lint:style:html_ --concurrency 16 --cache-dir .cache/turbo --filter ${packageName}',
						'lint:style:html_':
							"stylelint --customSyntax=postcss-html --cache true --cache-strategy content --cache-location .cache/stylelintcache-html --allow-empty-input '**/*.{html,svelte,vue,astro,xml,php}'",
					},
					devDependencies: {
						'@alexaegis/stylelint-config': `^${packageJson.version}`,
						stylelint: packageJson.devDependencies.stylelint,
					},
				},
			},
		],
	};
};

export default plugin;
