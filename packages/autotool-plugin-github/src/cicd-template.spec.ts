import { readFile } from 'node:fs/promises';
import { parse, stringify } from 'yaml';
import { describe, expect, it } from 'vitest';

interface WorkflowJob {
	if?: string;
	needs?: string | string[];
	strategy?: { matrix?: Record<string, unknown> };
}

interface Workflow {
	jobs: Record<string, WorkflowJob>;
}

const templateUrl = new URL('../static/cicd.yml', import.meta.url);

const readTemplate = async (): Promise<string> => readFile(templateUrl, { encoding: 'utf8' });

const readWorkflow = async (): Promise<Workflow> => parse(await readTemplate()) as Workflow;

const needsOf = (job: WorkflowJob | undefined): string[] => [job?.needs ?? []].flat();

describe('cicd.yml template', () => {
	it('should be the same as the live workflow of this repository', async () => {
		const live = await readFile(
			new URL('../../../.github/workflows/cicd.yml', import.meta.url),
			'utf8',
		);
		expect(live).toBe(await readTemplate());
	});

	it('should release after the needed jobs that have their own condition were skipped', async () => {
		const { jobs } = await readWorkflow();
		const release = jobs['release'];
		const needs = needsOf(release);
		const needResultConditions = needs.map((job) =>
			jobs[job]?.if === undefined
				? `needs.${job}.result == 'success'`
				: `(needs.${job}.result == 'success' || needs.${job}.result == 'skipped')`,
		);
		const conditions = (release?.if ?? '').trim().split(/ &&\n/);

		expect(needResultConditions.some((condition) => condition.includes('skipped'))).toBe(true);
		expect(conditions).toStrictEqual([
			'!cancelled()',
			...needResultConditions,
			'needs.collect.outputs.non_published_packages',
			'github.ref_name == github.event.repository.default_branch',
			"github.event_name != 'pull_request'",
		]);
	});

	it('should need every job whose outputs or result a job reads', async () => {
		const { jobs } = await readWorkflow();
		for (const [jobName, job] of Object.entries(jobs)) {
			const readJobs = new Set(
				stringify(job)
					.matchAll(/needs\.([\w-]+)\./g)
					.map((match) => match[1]),
			);
			for (const readJob of readJobs) {
				expect(needsOf(job), `${jobName} reads ${String(readJob)}`).toContain(readJob);
			}
		}
	});

	it('should run only scripts that the root package.json of this repository defines', async () => {
		const template = await readTemplate();
		const { jobs } = parse(template) as Workflow;
		const rootPackageJson = JSON.parse(
			await readFile(new URL('../../../package.json', import.meta.url), 'utf8'),
		) as { scripts: Record<string, string> };
		const lintKinds = (jobs['lint']?.strategy?.matrix?.['lint-kind'] ?? []) as string[];
		const runScripts = [
			...template.matchAll(/pnpm run ([\w:-]+)$/gm).map((match) => match[1]),
			...lintKinds.map((lintKind) => `lint:${lintKind}`),
		];

		expect(lintKinds).not.toHaveLength(0);
		expect(runScripts).toContain('docs:build');
		for (const script of runScripts) {
			expect(Object.keys(rootPackageJson.scripts)).toContain(script);
		}
	});
});
