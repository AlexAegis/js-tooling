import type { AllBinPathCombinations } from '../bin/auto-bin.class.js';
import type { AllExportPathCombinations } from './auto-export.class.js';

export type PathVariantMap<
	Variants extends AllExportPathCombinations | AllBinPathCombinations =
		| AllExportPathCombinations
		| AllBinPathCombinations,
> = Record<Variants, string>;

/**
 * An exportmaps key describes the name of the export and the value is the path
 * relative from the packageJson file.
 *
 * ExportMaps could contain paths that are correct only from the DEVELOPMENT
 * packageJson or that are meant for the DISTRIBUTION package.
 *
 * TODO: This is why there's an additional flag next to each path.
 * @example in a workspace like:
 * /project/package/foo/
 * 						- package.json
 * 						- src/api
 * 								- /index.ts
 * 								- /hello.ts
 * 								- /a/index.ts
 * 								- /b/hello.ts
 *
 * With the following pakk config:
 * ```json
 * {
 * 		"srcDir": "src",
 * 		"exportsBasePath": "api",
 * 		"exports": ["**\/*.ts"],
 * }
 * ```
 *
 * The following exports object will be created:
 *
 * ```json
 * {
 * 	"exportMap": {
 * 		".": {
 * 			"development-to-source": "./src/api/index.ts",
 * 			"development-to-dist": "./dist/api/index.js",
 * 			"distribution-to-source": "./src/api/index.ts",
 * 		},
 * 		"./hello": {
 * 			"development-to-source": "./src/api/hello.ts",
 * 			"development-to-dist": "./dist/api/hello.js",
 * 			"distribution-to-source": "./src/api/hello.ts",
 * 		},
 * 		"./a": {
 * 			"development-to-source": "./src/api/a/index.ts",
 * 			"development-to-dist": "./dist/api/a/index.js",
 * 			"distribution-to-source": "./src/api/a/index.ts",
 * 		},
 * 		"./b/hello": {
 * 			"development-to-source": "./src/api/b/hello.ts",
 * 			"development-to-dist": "./dist/api/b/hello.js",
 * 			"distribution-to-source": "./src/api/b/hello.ts",
 * 		}
 * 	}
 * }
 * ```
 * This exportMap will then be later used to create the packageJson exportMap
 *
 * As you might notice, because inferring /index to the name of it's parent,
 * two paths can result in the same name if there is a file and a folder with
 * the same name. If this happens, pakk will simply throw an error.
 *
 * TODO: throw an error on name collisions like hello.ts vs hello/index.ts
 */
export type EntryPathVariantMap<
	Variants extends AllExportPathCombinations | AllBinPathCombinations =
		| AllExportPathCombinations
		| AllBinPathCombinations,
> = Record<string, PathVariantMap<Variants>>;
