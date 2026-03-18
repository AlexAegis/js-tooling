import type { PackageJson } from '@alexaegis/workspace-tools';
import type { Argv } from 'yargs';
import yargs from 'yargs';
import { defaultYargsFromPackageJson } from '../index.js';

export type YargsMutator<T, R> = (yargs: Argv<T>) => Argv<T & R>;

export class YargsBuilder<T> {
	private mutators: YargsMutator<object, T>[] = [];

	static empty(): YargsBuilder<object> {
		return new YargsBuilder();
	}

	/**
	 * Creates a YargsBuilder with some default options:
	 * - enables help
	 * - adds metadata found in packageJson for
	 *   - version
	 *   - epilogue showing the repository url
	 *
	 * It does not add any options
	 */
	static withDefaults<T extends PackageJson>(packageJson?: T): YargsBuilder<object> {
		return new YargsBuilder().add(defaultYargsFromPackageJson(packageJson));
	}

	add<R>(mutator: YargsMutator<T, R>): YargsBuilder<T & R> {
		if (typeof mutator === 'function') {
			this.mutators.push(mutator as YargsMutator<object, T & R>);
		}

		return this as YargsBuilder<T & R>;
	}

	/***
	 * usage: pass
	 */
	build(
		args: string | readonly string[] | undefined = process.argv.splice(2),
		cwd?: string | undefined,
	): Argv<T> {
		let y = yargs(args, cwd) as Argv<T>;
		for (const mutator of this.mutators) {
			y = mutator(y) as Argv<T>;
		}
		return y;
	}
}
