import type { JSONSchemaForNPMPackageJsonFiles } from '@schemastore/package';
import type { PackageJsonExportConditions } from './package-json-export-conditions.type.js';

export type PackageJsonExports = Record<string, PackageJsonExportConditions | string>;

export type PackageJson = JSONSchemaForNPMPackageJsonFiles & {
	exports?: PackageJsonExports;
};
