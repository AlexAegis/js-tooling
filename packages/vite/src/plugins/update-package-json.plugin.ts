import type { JSONSchemaForNPMPackageJsonFiles as PackageJson } from '@schemastore/package';

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Plugin } from 'vite';
import { prettify } from '../helpers';

export interface UpdatePackageJsonPluginOptions {
	filename?: string;
	updater: (packageJson: PackageJson) => PackageJson;
	cwd?: string;
	autoPrettier?: boolean;
}

export const updatePackageJsonPlugin = (options: UpdatePackageJsonPluginOptions): Plugin => ({
	name: 'update-package-json',
	apply: 'build',
	buildEnd: (error) => {
		if (!error) {
			const cwd = options.cwd ?? process.cwd();
			const packageJsonLocation = join(cwd, options.filename ?? 'package.json');
			const rawPackageJson = readFileSync(packageJsonLocation, {
				encoding: 'utf8',
			});
			const packageJson = JSON.parse(rawPackageJson) as PackageJson;
			const augmentedPackageJson = options.updater(packageJson);
			const rawAugmentedPackageJson = JSON.stringify(augmentedPackageJson);

			if (options.autoPrettier ?? true) {
				prettify(rawAugmentedPackageJson)
					.then((formatted) => {
						writeFileSync(packageJsonLocation, formatted);
					})
					.catch((_error) => {
						writeFileSync(packageJsonLocation, rawAugmentedPackageJson);
					});
			} else {
				writeFileSync(packageJsonLocation, rawAugmentedPackageJson);
			}
		}
	},
});
