import { beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import yargs, { type Argv } from 'yargs';
import { defaultYargsFromPackageJson } from './default-yargs.function.js';

describe('defaultYargs', () => {
	let yargsInstance!: Argv;
	let versionSpy: MockInstance<(_: string) => Argv<{}>>;
	let epilogueSpy: MockInstance<(_: string) => Argv<{}>>;

	beforeEach(() => {
		yargsInstance = yargs([]);
		versionSpy = vi.spyOn(yargsInstance, 'version');
		epilogueSpy = vi.spyOn(yargsInstance, 'epilogue');
	});

	it('should be fully filled from a filled packageJson file where the repository field is an object', async () => {
		const yarguments = defaultYargsFromPackageJson({
			name: 'name',
			version: '1',
			description: 'descriptions',
			repository: { url: 'homepage' },
		})(yargsInstance);

		const args = await yarguments.parseAsync();

		expect(args).toBeDefined();
		expect(versionSpy).toHaveBeenCalledOnce();
		expect(epilogueSpy).toHaveBeenCalledOnce();
	});

	it('should be fully filled from a filled packageJson file where the repository is a string', async () => {
		const args = await defaultYargsFromPackageJson({
			name: 'name',
			version: '1',
			description: 'descriptions',
			repository: 'homepage',
		})(yargsInstance).parseAsync();

		expect(args).toBeDefined();
		expect(versionSpy).toHaveBeenCalledOnce();
		expect(epilogueSpy).toHaveBeenCalledOnce();
	});

	it('should be working from an empty packageJson file', async () => {
		const args = await defaultYargsFromPackageJson()(yargsInstance).parseAsync();

		expect(args).toBeDefined();
		expect(versionSpy).not.toHaveBeenCalledOnce();
		expect(epilogueSpy).not.toHaveBeenCalledOnce();
	});
});
