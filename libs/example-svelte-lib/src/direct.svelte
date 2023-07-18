<script lang="ts">
	import Hello from './components/hello.svelte';

	export let name = 'direct';
</script>

<h1>I'm part of the package API {name}</h1>

<Hello name="direct hello"></Hello>
<style>
	h1 {
		color: azure;
	}
</style>
