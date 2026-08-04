<script lang="ts">
	import H1 from './h1.svelte';

	interface Props {
		error: string;
		message?: string;
	}

	let { error, message }: Props = $props();
</script>

<main>
	<H1 />

	<div>
		<p style="font-weight: bold; font-size: 2rem;">{error}</p>

		{#if message}
			<p style="font-size: 1.25rem; color: var(--color-neutral);">{message}</p>
		{/if}
	</div>
</main>

<style>
	main {
		max-width: 60ch;
		width: 100%;
		margin: auto;

		display: grid;
		gap: 1rem;

		padding: 1rem;
		box-sizing: border-box;
	}

	p {
		margin: 0;
	}

	p {
		font-family: var(--font-sans);
		font-size: 1rem;
		color: var(--color-primary);
		text-wrap: pretty;
	}
</style>
