// TODO: collect scopes from packages
// TODO: setup config package
module.exports = {
	extends: ['@commitlint/config-conventional'],
	type: ['feat', 'fix', 'test', 'docs', 'refactor', 'build', 'ci', 'perf', 'revert', 'style'],
	rules: {
		'scope-enum': [2, 'always', ['setup-husky', 'docs', 'lint', 'changelog', 'release']],
	},
};
