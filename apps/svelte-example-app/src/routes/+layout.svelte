<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';

	// Most of your app wide CSS should be put in this file
	import { AppBar, AppShell } from '@skeletonlabs/skeleton';
	import packageJson from '../../../../package.json';
	import '../app.postcss';
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase">Example</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<a
					class="btn btn-sm variant-ghost-surface"
					href="{packageJson.homepage}"
					target="_blank"
					rel="noreferrer"
				>
					GitHub
				</a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<div class="main-layout">
		<slot />
	</div>
</AppShell>

<style>
	.main-layout {
		padding: 1em;
		max-width: 800px;
		margin-left: auto;
		margin-right: auto;
	}
</style>
