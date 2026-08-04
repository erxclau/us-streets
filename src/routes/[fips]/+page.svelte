<script lang="ts">
	import App from '$lib/app.svelte';
	import AppError from '$lib/error.svelte';
	import Spinner from '$lib/spinner.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Name {data.server.name}, {data.server.state.postal} streets</title>
</svelte:head>

{#await data.features}
	<main>
		<div style="display: flex; gap: 0.75rem; align-items: center;">
			<Spinner />
			<div>Loading map...</div>
		</div>
	</main>
{:then features}
	<App
		{features}
		bbox={data.bbox}
		name={data.server.name}
		state={data.server.state}
		fips={data.server.fips}
	/>
{:catch err: Error}
	<AppError error={err.name} message={err.message} />
{/await}

<style>
	main {
		max-width: 60ch;
		width: 100%;
		margin: auto;

		gap: 1rem;

		padding: 1rem;
		box-sizing: border-box;

		display: flex;
		min-height: 100dvh;
		justify-content: center;
		align-items: center;

		font-family: var(--font-sans);
		font-size: 1.5rem;
		color: var(--color-neutral);
	}
</style>
