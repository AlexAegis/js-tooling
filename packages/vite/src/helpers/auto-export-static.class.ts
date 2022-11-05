import { join } from 'node:path';
import {
	AutoExportStaticOptions,
	normalizeAutoExportStaticOptions,
} from './auto-export-static.class.options.js';
import { collectFileMap } from './collect-export-map.function.js';
import { copyAllInto } from './copy-all-into.function.js';
import type { PackageJson } from './package-json.type.js';
import type { PreparedBuildUpdate } from './prepared-build-update.type.js';
export class AutoExportStatic implements PreparedBuildUpdate {
	private options: Required<AutoExportStaticOptions>;
	private staticExports: Record<string, string> = {};

	constructor(options: AutoExportStaticOptions) {
		this.options = normalizeAutoExportStaticOptions(options);
	}

	preUpdate(packageJson: PackageJson): PackageJson {
		packageJson.exports = undefined;
		return packageJson;
	}

	async update(packageJson: PackageJson): Promise<PackageJson> {
		this.staticExports = await collectFileMap(this.options.cwd, this.options.staticExportGlobs);

		console.log('CWDF', this.options.cwd);
		console.log(
			'asd',
			this.options.outDir,
			this.options.staticExportGlobs,
			JSON.stringify(this.staticExports)
		);
		await copyAllInto(
			Object.values(this.staticExports),
			join(this.options.cwd, this.options.outDir)
		);

		packageJson.exports = { ...this.staticExports, ...packageJson.exports };
		return packageJson;
	}
}
