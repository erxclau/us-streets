<script lang="ts">
	import { onMount } from 'svelte';
	import { dev } from '$app/env';
	import { resolve } from '$app/paths';
	import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';

	import { type FeatureSelector, type GeoJSONSource, Map as MapboxMap } from 'mapbox-gl/esm';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import { deserialize } from 'flatgeobuf/lib/mjs/geojson';

	import { minUsLat, maxUsLon, minUsLon, maxUsLat } from '$lib/data/us-bbox';
	import stateFips from '$lib/data/fips';
	import Details from './details.svelte';
	import H1 from './h1.svelte';
	import type { PPAFeature } from './data/ppa';

	const zoomThreshold = 8;

	interface Props {
		location: {
			longitude: number;
			latitude: number;
		};
	}

	let { location }: Props = $props();
	let ref: HTMLDivElement;
	let selectedFeature = $state<PPAFeature | undefined>(undefined);
	let showZoomHint = $state(false);

	onMount(() => {
		const map = new MapboxMap({
			container: ref,
			accessToken: PUBLIC_MAPBOX_TOKEN,
			center: [location.longitude, location.latitude],
			minZoom: 4,
			zoom: 10,
			maxZoom: 15,
			dragRotate: false,
			fitBoundsOptions: {
				padding: 5
			},
			style: 'mapbox://styles/ericlau00/cmse3gtl0000l01sq3xtx0lsb'
		});

		map.setMaxBounds([
			[minUsLon, minUsLat],
			[maxUsLon, maxUsLat]
		]);

		map.touchZoomRotate.disableRotation();

		let ppaSource: GeoJSONSource | undefined = undefined;

		async function loadPPAs() {
			if (ppaSource === undefined) {
				return;
			}

			const zoom = map.getZoom();
			showZoomHint = zoom < zoomThreshold;

			const bounds = map.getBounds();
			if (bounds === null || zoom < zoomThreshold) {
				return;
			}

			const [[minLon, minLat], [maxLon, maxLat]] = bounds.toArray();

			let fgb: AsyncGenerator<PPAFeature>;
			try {
				fgb = deserialize(dev ? '/ppa.fgb' : 'https://r2.erxclau.me/ppa.fgb', {
					minX: minLon,
					minY: minLat,
					maxX: maxLon,
					maxY: maxLat
				}) as AsyncGenerator<PPAFeature>;
			} catch (err) {
				console.error(err);
				return;
			}

			const ppaFeatures = await Array.fromAsync(fgb);
			// const newPPAFeatures = ppaFeatures.filter((f) => !ppaIds.has(f.properties.fips));

			ppaSource.setData({
				type: 'FeatureCollection',
				features: ppaFeatures.map((f) => {
					return {
						...f,
						properties: f.properties,
						id: f.properties.fips
					};
				})
			});
		}

		map.on('load', () => {
			map.addSource('source-ppa', {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: []
				},
				promoteId: 'fips'
			});

			ppaSource = map.getSource('source-ppa');

			map.addLayer({
				id: 'layer-ppa-fill',
				source: 'source-ppa',
				type: 'fill',
				paint: {
					'fill-color': '#0f59d7',
					'fill-opacity': ['case', ['boolean', ['feature-state', 'highlight'], false], 0.75, 0.25]
				}
			});

			map.addLayer({
				id: 'layer-ppa-line',
				source: 'source-ppa',
				type: 'line',
				paint: {
					'line-color': '#0f59d7',
					'line-width': ['case', ['boolean', ['feature-state', 'highlight'], false], 2, 1]
				}
			});

			loadPPAs();
		});

		map.on('moveend', loadPPAs);

		map.on('click', 'layer-ppa-fill', (e) => {
			const clickedFeatures = e.features;
			if (clickedFeatures === undefined || clickedFeatures.length === 0) {
				return;
			}

			if (selectedFeature !== undefined) {
				map.setFeatureState(
					{
						id: selectedFeature.id,
						source: 'source-ppa'
					} as FeatureSelector,
					{
						highlight: false
					}
				);
			}

			const feature = clickedFeatures[0] as unknown as PPAFeature;

			map.setFeatureState(
				{
					id: feature.id,
					source: 'source-ppa'
				} as FeatureSelector,
				{
					highlight: true
				}
			);

			selectedFeature = feature;
		});

		return () => {
			map.remove();
		};
	});
</script>

<main>
	<hgroup>
		<div id="form">
			<H1 />

			<div style="display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
				{#if selectedFeature === undefined}
					<div class="button">Select a place</div>
				{:else}
					{@const state = selectedFeature.properties.fips.substring(0, 2)}
					<a class="button" href={resolve(`/${selectedFeature.properties.fips}`)}
						>Select {selectedFeature.properties.name}, {stateFips[state as keyof typeof stateFips]
							.name}</a
					>
				{/if}

				{#if showZoomHint}
					<p>Zoom in to show places</p>
				{/if}
			</div>
		</div>

		<div style="display: grid; gap: calc(var(--gap) / 2);">
			<details>
				<summary style="color: var(--color-neutral)"
					><span style="font-size: 0.925rem;">Details</span></summary
				>
				<div style="padding-left: 0.625rem;">
					<Details />
				</div>
			</details>
		</div>
	</hgroup>

	<figure>
		<div id="map" bind:this={ref}></div>
	</figure>
</main>

<style>
	main {
		width: 100%;
		box-sizing: border-box;
		position: relative;
	}

	hgroup {
		--padding: 0.875rem;
		--gap: 0.625rem;
		--margin: 0.5rem;
		position: absolute;
		top: 0;
		z-index: 1;
		padding: var(--padding);
		padding-top: 0;
		display: grid;
		overflow-y: scroll;
		max-height: calc(100vh - 36px - var(--margin));

		margin-top: var(--margin);
		margin-left: var(--margin);
	}

	hgroup,
	.button {
		box-shadow: 0 0 1px 1px rgb(from var(--color-neutral) r g b / 0.25);
		border-radius: 0.375rem;
	}

	hgroup {
		background-color: var(--color-secondary);
		width: 100%;
		box-sizing: border-box;
		max-width: 400px;
	}

	#form {
		display: grid;
		gap: var(--gap);
		position: sticky;
		top: 0;
		padding-top: var(--padding);
		padding-bottom: var(--gap);
		background-color: inherit;
	}

	.button {
		font-family: var(--font-sans);
		background-color: var(--color-primary);
		color: var(--color-secondary);
		border: none;
		font-size: 1rem;
		transition:
			background-color 125ms linear,
			color 125ms linear,
			opacity 125ms linear;
		padding: 0.125rem 0.375rem;
		text-decoration: none;
		width: fit-content;
		text-wrap: pretty;
	}

	div.button {
		background-color: var(--color-primary);
		color: var(--color-secondary);
		opacity: 50%;
	}

	a.button:active,
	a.button:hover,
	a.button:focus {
		background-color: var(--color-highlight);
		color: var(--color-secondary-active);
	}

	@media screen and (max-width: 600px) {
		hgroup {
			--padding: 0.625rem;
			--gap: 0.375rem;
			--margin: 0;
			border-radius: 0;
			max-width: calc(100% - var(--margin) * 2);
			top: unset;
			bottom: var(--margin);
			max-height: 50vh;
		}

		:global(.mapboxgl-ctrl-bottom-right, .mapboxgl-ctrl-bottom-left) {
			bottom: unset;
			top: 0;
		}

		:global(.mapboxgl-ctrl-bottom-left .mapboxgl-ctrl) {
			margin: 10px 10px 0;
		}
	}

	summary {
		list-style-type: '+ ';
		font-family: var(--font-sans);
		cursor: pointer;
		list-style-position: outside;
		margin-left: 10px;
		color: var(--color-primary);
	}

	details[open] > summary {
		list-style-type: '− ';
	}

	details {
		display: grid;
		gap: 0.125rem;
	}

	p {
		margin: 0;
		font-family: var(--font-sans);
		font-size: 1rem;
		color: var(--color-neutral);
		text-wrap: pretty;
	}

	figure {
		margin: 0;
		position: relative;
		width: 100vw;
		height: 100dvh;
	}

	#map {
		position: absolute;
		width: 100%;
		height: 100%;
	}
</style>
