<script lang="ts">
	import packageJson from '../../../../package.json';
	import '../app.css';
</script>

<div class="grid h-screen grid-rows-[auto_1fr_auto]">
	<!-- Header -->
	<header class="bg-red-500 p-4">
		<strong class="text-xl uppercase">Example</strong>
	</header>
	<!-- Main -->
	<main class="space-y-4 bg-green-500 p-4">
		<slot />
	</main>
	<!-- Footer -->
	<footer class="bg-blue-500 p-4">
		<a
			class="btn btn-sm preset-tonal-surface border-surface-500 border"
			href={packageJson.homepage}
			target="_blank"
			rel="noreferrer"
		>
			GitHub
		</a>
	</footer>
</div>
