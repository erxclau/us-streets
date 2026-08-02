<script>
	import { page } from '$app/state';
</script>

<main>
	<h1>
		Name U.<span class="non-wonk">S</span>. <span class="non-wonk">s</span>treet<span
			class="non-wonk">s</span
		>
	</h1>

	<div>
		<p style="font-weight: bold; font-size: 2rem;">{page.status} error</p>

		{#if page.error}
			<p style="font-size: 1.25rem;">{page.error.message}</p>
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

	h1 {
		font-family: var(--font-headline);
		color: var(--color-headline);
		font-size: calc(1rem + 0.875vw);
		font-weight: 300;
		text-wrap: pretty;
		line-height: calc(1rem + 0.875vw);
	}

	.non-wonk {
		font-variation-settings: 'WONK' 0;
	}

	h1,
	p {
		margin: 0;
	}

	p {
		font-family: var(--font-sans);
		font-size: 1rem;
		color: var(--color-neutral);
		text-wrap: pretty;
	}
</style>
