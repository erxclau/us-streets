<script lang="ts">
	import { onMount } from 'svelte';

	const baseHint = 'Enter a street name';

	interface Props {
		place?: {
			name: string;
			state: {
				name: string;
				postal: string;
			};
		};
	}

	let { place }: Props = $props();

	const hintOptions = $derived.by(() => {
		if (place === undefined) {
			return [baseHint];
		}

		const aOrAn = place.name.charAt(0).toLowerCase() === 'a' ? 'an' : 'a';

		return [
			`Enter ${aOrAn} ${place.name}, ${place.state.name} street name`,
			`Enter ${aOrAn} ${place.name}, ${place.state.postal} street name`,
			`Enter ${aOrAn} ${place.name} street name`
		];
	});

	let displayHint = $state<string>(baseHint);

	let ref: HTMLInputElement;

	onMount(() => {
		const style = getComputedStyle(ref);
		const fontStyle = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
		const padding = parseInt(style.paddingLeft) + parseInt(style.paddingRight);

		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		if (context === null) {
			return;
		}

		context.font = fontStyle;

		for (const hint of hintOptions) {
			const hintWidth = context.measureText(hint).width;
			if (hintWidth <= ref.clientWidth - padding) {
				displayHint = hint;
				return;
			}
		}
	});
</script>

{#if place !== undefined && displayHint === baseHint && !hintOptions.includes(baseHint)}
	<p>{place.name}, {place.state.name}</p>
{/if}

<label for="attempt" class="sr-only">{displayHint}</label>
<input type="text" name="attempt" id="attempt" placeholder={displayHint} bind:this={ref} />

<style>
	label {
		font-family: var(--font-sans);
		color: var(--color-neutral);
		font-size: 0.875rem;
	}

	input {
		background-color: var(--color-primary);
		border: none;
		color: var(--color-secondary);
		font-family: var(--font-sans);
		font-size: 1.25rem;
		padding: 0.25rem;
		border-radius: 0.25rem;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	p {
		margin: 0;
		font-family: var(--font-sans);
		font-size: 1rem;
		color: var(--color-neutral);
		text-wrap: pretty;
	}
</style>
