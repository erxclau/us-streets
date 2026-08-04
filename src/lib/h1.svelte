<script lang="ts">
	interface Props {
		override?: string;
	}

	let { override }: Props = $props();
</script>

<h1>
	Name {#if override}
		{#each override as character, i (character + i)}
			{#if character.toLowerCase() === 's'}
				<span class="non-wonk">{character}</span>
			{:else}
				{character}
			{/if}
		{/each}
	{:else}
		U.<span class="non-wonk">S</span>.
	{/if} <span class="non-wonk">s</span>treet<span class="non-wonk">s</span>
</h1>

<style>
	h1 {
		font-family: var(--font-headline);
		color: var(--color-headline);
		font-size: min(calc(1rem + 0.875vw), 2rem);
		font-weight: 300;
		text-wrap: pretty;
		line-height: calc(1rem + 0.875vw);
		margin: 0;
	}

	.non-wonk {
		font-variation-settings: 'WONK' 0;
	}
</style>
