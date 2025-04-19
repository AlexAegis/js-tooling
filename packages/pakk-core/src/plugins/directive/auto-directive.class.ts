import type { PackageJson, RegularWorkspacePackage } from '@alexaegis/workspace-tools';

import { deepMapObject } from '@alexaegis/common';
import type { NormalizedPakkContext } from '../../index.js';
import { type PackageJsonKindType } from '../../package-json/index.js';
import type { PakkFeature } from '../pakk-feature.type.js';

export const pakkDirectivePrefix = 'pakk:';
export const pakkDirectiveNotDistributed = `${pakkDirectivePrefix}not-distributed`;
export const everyPakkDirective = [pakkDirectiveNotDistributed] as const;

/**
 * Processes pakk directives in the packageJson. They are strings that could
 * be present at either on a key or on a value. They can start with a # to let
 * them be interpreted as comments by the shell.
 *
 * - pakk:not-distributed will remove the entry when compiling the distributed
 *   package.json. When placed on a postinstall script, its effect will be
 *   similar to what `pinst` does.
 *
 *   ```json
 *   {
 *     "scripts": {
 *       "postinstall": "svelte-kit sync # pakk:not-distributed",
 *     }
 *   }
 *   ```
 */
export class AutoDirective implements PakkFeature {
	public readonly order = 5;

	private readonly context: NormalizedPakkContext;

	constructor(context: NormalizedPakkContext) {
		this.context = context;
		this.context.logger.info('enabled directives:');
		this.context.logger.info(pakkDirectiveNotDistributed);
	}

	postprocess(
		workspacePackage: RegularWorkspacePackage,
		packageJsonKind: PackageJsonKindType,
	): PackageJson {
		return deepMapObject<PackageJson>(workspacePackage.packageJson, (key, value) => {
			if (
				packageJsonKind === 'development' &&
				typeof key === 'string' &&
				key.includes(pakkDirectivePrefix) &&
				everyPakkDirective.every((directive) => !key.includes(directive))
			) {
				this.context.logger.warn(
					'key contains a pakk directive that is not recognized',
					key,
				);
			}

			if (
				packageJsonKind === 'development' &&
				typeof value === 'string' &&
				value.includes(pakkDirectivePrefix) &&
				everyPakkDirective.every((directive) => !value.includes(directive))
			) {
				this.context.logger.warn(
					'value contains a pakk directive that is not recognized',
					value,
				);
			}

			return packageJsonKind === 'distribution' &&
				((typeof key === 'string' && key.includes(pakkDirectiveNotDistributed)) ||
					(typeof value === 'string' && value.includes(pakkDirectiveNotDistributed)))
				? undefined
				: value;
		});
	}
}
