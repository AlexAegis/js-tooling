<script lang="ts">
	import { hello } from '@alexaegis/example-ts-lib';
	import svelteLogo from './assets/svelte.svg';
	import Counter from './lib/counter.svelte';
	hello('asd');
</script>

<main>
	<div>
		<a href="https://svelte.dev" target="_blank" rel="noreferrer">
			<img src="{svelteLogo}" class="logo svelte" alt="Svelte Logo" />
		</a>
	</div>
	<h1>Svelte</h1>

	<div class="card">
		<Counter />
	</div>
</main>

<style lang="scss">
	main {
		height: 12px;
		display: grid;
		justify-content: center;
		justify-items: center;
	}
</style>
