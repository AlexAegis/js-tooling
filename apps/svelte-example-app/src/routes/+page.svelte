<script lang="ts">
	import { Hello, message } from '@alexaegis/example-svelte-lib';
	// import Direct from '@alexaegis/example-svelte-lib/direct'; // TODO: since the typedefs are only available for svelte libs after packaging, make build a dependency of lint:svelte
</script>

<div class="card m-12">
	<header class="card-header">
		<h1 class="h1">
			<span
				class="bg-gradient-to-br from-blue-500 to-cyan-300 bg-clip-text text-transparent box-decoration-clone"
			>
				Example App
			</span>
		</h1>
	</header>
	<section class="p-4">
		<p>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi iure quisquam culpa in,
			ipsa qui maiores quam officia omnis dolore officiis! Aspernatur qui ipsam incidunt quod
			cupiditate reiciendis dolorem ab.
		</p>
	</section>
	<section class="p-4">
		<Hello name="example app"></Hello>
		<!-- <Direct ></Direct> -->
	</section>
	<section class="p-4">
		This string is imported from example-svelte-lib, but is actually defined in example-ts-lib:
		<h4>{message}</h4>
	</section>
</div>
