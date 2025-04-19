import { ALL_VITE_LIBRARY_FORMATS, PACKAGE_JSON_KIND, pakkFeatures } from '@pakk/core';
import type { Argv } from 'yargs';

export const yargsForPakk = (yargs: Argv<unknown>): Argv<unknown> => {
	return yargs
		.option('srcDir', {
			description: 'Source root, relative to the package directory',
			string: true,
			default: 'src',
		})
		.option('outDir', {
			description: "The expected output directory relative to the package's directory.",
			string: true,
			default: 'dist',
		})
		.option('sourcePackageJson', {
			description:
				"packageJson to modify and put in the artifact, relative to the package's directory.",
			string: true,
			default: 'package.json',
		})
		.option('autoPrettier', {
			description: 'Enable prettier integration',
			boolean: true,
			default: true,
		})
		.option('svelte', {
			description: 'Features for svelte libraries, like defining svelte exports',
			boolean: true,
			default: false,
		})
		.option('targetPackageJsonKind', {
			description: 'Which packageJson to act on. Will do both when left empty.',
			choices: Object.values(PACKAGE_JSON_KIND),
			default: undefined,
		})
		.option('enabledFeatures', {
			description: 'When defined only these features will be enabled.',
			choices: pakkFeatures,
			array: true,
			string: true,
		})
		.option('disabledFeatures', {
			description: 'When defined these features will be disabled.',
			choices: pakkFeatures,
			array: true,
			string: true,
		})
		.option('formats', {
			description: 'What library formats to expect to be output',
			choices: ALL_VITE_LIBRARY_FORMATS,
			array: true,
			string: true,
		});
};
