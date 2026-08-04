<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';

	import { Map as MapboxMap, type FeatureSelector } from 'mapbox-gl/esm';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import type { Feature, GeoJsonProperties, Polygon } from 'geojson';
	import length from '@turf/length';
	import { ascending, sum } from 'd3-array';

	import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';
	import { formatFeatureName, matchFeature, type RoadFeature } from './tiger';
	import Details from './details.svelte';
	import H1 from './h1.svelte';

	interface Props {
		features: Array<RoadFeature>;
		bbox: {
			coordinates: {
				minX: number;
				minY: number;
				maxX: number;
				maxY: number;
			};
			polygon: Feature<Polygon, GeoJsonProperties>;
		};
	}

	let { bbox, features }: Props = $props();

	const totalMiles = $derived(sum(features, (d) => length(d, { units: 'miles' })));

	const modalId = 'confirm-reset-progress';
	const localStorageKey = $derived(
		`${bbox.coordinates.minX}.${bbox.coordinates.minY}.${bbox.coordinates.maxX}.${bbox.coordinates.maxY}`
	);

	let map: MapboxMap;
	let ref: HTMLDivElement;

	const numberFormat = Intl.NumberFormat('en-US', {
		maximumFractionDigits: 0
	});

	// eslint-disable-next-line svelte/no-unnecessary-state-wrap
	let linearIds: SvelteSet<string> = $state(new SvelteSet());

	const identifiedFeatures = $derived(features.filter((d) => linearIds.has(d.properties.LINEARID)));

	const identifiedStreets = $derived(
		Array.from(new Set(identifiedFeatures.map(formatFeatureName))).sort(ascending)
	);

	const identifiedMiles = $derived(sum(identifiedFeatures, (d) => length(d, { units: 'miles' })));

	const updateFeatureState = () => {
		for (const id of linearIds) {
			const featureSelector = {
				id: id,
				source: 'source-features'
			} as FeatureSelector;

			const highlighted = map.getFeatureState(featureSelector)?.['highlight'];
			if (!highlighted) {
				map.setFeatureState(featureSelector, {
					highlight: true
				});
			}
		}
	};

	onMount(() => {
		const localObjectIds = localStorage.getItem(localStorageKey);
		if (localObjectIds !== null) {
			let json: Array<string> = [];
			try {
				json = JSON.parse(localObjectIds);
			} catch (e) {
				console.error(e);
			}

			if (Array.isArray(json)) {
				linearIds = new SvelteSet(json);
			}
		}

		map = new MapboxMap({
			container: ref,
			accessToken: PUBLIC_MAPBOX_TOKEN,
			bounds: [
				[bbox.coordinates.minX, bbox.coordinates.minY],
				[bbox.coordinates.maxX, bbox.coordinates.maxY]
			],
			minZoom: 9,
			dragRotate: false,
			fitBoundsOptions: {
				padding: 5
			},
			style: 'mapbox://styles/ericlau00/cmpnd0ozj005901qpg03724r0'
		});

		const bounds = map.getBounds();
		if (bounds) {
			map.setMaxBounds(bounds);
		}

		map.touchZoomRotate.disableRotation();

		map.on('load', () => {
			map.addSource('source-bbox', {
				type: 'geojson',
				data: bbox.polygon
			});

			map.addLayer({
				id: 'layer-bbox',
				type: 'line',
				source: 'source-bbox',
				paint: {
					'line-color': '#000',
					'line-width': 3
				}
			});

			map.addSource('source-features', {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: features.map((f) => {
						return {
							type: f.type,
							id: f.properties.LINEARID,
							geometry: f.geometry,
							properties: {}
						};
					})
				}
			});

			map.addLayer({
				id: 'layer-features',
				source: 'source-features',
				type: 'line',
				paint: {
					'line-color': [
						'case',
						['boolean', ['feature-state', 'highlight'], false],
						'#0f59d7',
						'#0444a1'
					],
					'line-opacity': ['case', ['boolean', ['feature-state', 'highlight'], false], 1, 0.125],
					'line-width': [
						'interpolate',
						['linear'],
						['zoom'],
						11,
						['case', ['boolean', ['feature-state', 'highlight'], false], 1.25, 0.5],
						12.5,
						['case', ['boolean', ['feature-state', 'highlight'], false], 3, 0.5]
					]
				}
			});

			if (linearIds.size > 0) {
				map.on('sourcedata', (e) => {
					if (e.sourceId === 'source-features' && e.isSourceLoaded) {
						updateFeatureState();
					}
				});
			}
		});

		map.on('move', () => {
			if (linearIds.size > 0) {
				updateFeatureState();
			}
		});

		return () => {
			map.remove();
		};
	});

	$effect(() => {
		localStorage.setItem(localStorageKey, JSON.stringify(Array.from(linearIds)));
	});
</script>

<main>
	<hgroup>
		<div id="form">
			<H1 />

			<form
				onsubmit={async (e) => {
					e.preventDefault();
					const formData = new FormData(e.currentTarget);
					const attemptData = formData.get('attempt');

					if (!attemptData) {
						return;
					}

					const attempt = attemptData.toString().toLowerCase().trim();
					const matchedFeatures = features.filter((f) => matchFeature(f, attempt));

					let oldLinearIdsSize = linearIds.size;

					linearIds = new SvelteSet(
						linearIds.union(new Set(matchedFeatures.map((d) => d.properties.LINEARID)))
					);

					if (oldLinearIdsSize !== linearIds.size) {
						updateFeatureState();
						e.currentTarget.reset();
						return;
					}

					const input = e.currentTarget.querySelector('input');
					if (!input) {
						return;
					}

					input.classList.remove('shake');
					await tick();
					input.classList.add('shake');
				}}
			>
				<label for="attempt" class="sr-only">Enter a street name</label>
				<input type="text" name="attempt" id="attempt" placeholder="Enter a street name" />
			</form>
		</div>

		<div style="display: grid; gap: calc(var(--gap) / 2);">
			<details>
				<summary>
					<p style="color: var(--color-primary);">
						{#key identifiedMiles}
							<span class="number" class:update={identifiedMiles > 0}
								>{numberFormat.format(identifiedMiles)}</span
							>
						{/key}
						of
						<span class="number">{numberFormat.format(totalMiles)}</span>
						miles
						{#key identifiedMiles}
							<span class="parenthesis" class:update={identifiedMiles > 0}
								>(<span class="number">{Math.round((identifiedMiles / totalMiles) * 100)}</span
								>%)</span
							>
						{/key}
						identified
					</p>
				</summary>
				<ul class="streets">
					{#each identifiedStreets as street (street)}
						<li class="street update">{street}</li>
					{/each}
				</ul>
			</details>

			<details>
				<summary style="color: var(--color-neutral)"
					><span style="font-size: 0.925rem;">Settings and details</span></summary
				>
				<div style="padding-left: 0.625rem; display: grid; gap: 0.375rem;">
					<Details />

					<div>
						<button command="show-modal" commandfor={modalId} disabled={linearIds.size === 0}
							>Reset progress</button
						>

						<dialog id={modalId}>
							<div style="display: grid; gap: var(--gap);">
								<p>Are you sure you want to reset your progress?</p>

								<menu>
									<li>
										<button commandfor={modalId} command="close">Cancel</button>
									</li>
									<li>
										<form method="dialog">
											<button
												onclick={() => {
													for (const id of linearIds) {
														const featureSelector = {
															id: id,
															source: 'source-features'
														} as FeatureSelector;

														const highlighted = map.getFeatureState(featureSelector)?.['highlight'];
														if (highlighted) {
															map.setFeatureState(featureSelector, {
																highlight: false
															});
														}
													}

													linearIds = new SvelteSet();
												}}>Confirm</button
											>
										</form>
									</li>
								</menu>
							</div>
						</dialog>
					</div>
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
	dialog,
	button {
		box-shadow: 0 0 1px 1px rgb(from var(--color-neutral) r g b / 0.25);
		border-radius: 0.375rem;
	}

	hgroup,
	dialog {
		background-color: var(--color-secondary);
		width: 100%;
		box-sizing: border-box;
		max-width: 400px;
	}

	dialog {
		padding: var(--padding);
		border: none;
		max-width: fit-content;
	}

	button {
		font-family: var(--font-sans);
		background-color: var(--color-primary);
		color: var(--color-secondary);
		border: none;
		font-size: 0.875rem;
		transition:
			background-color 125ms linear,
			color 125ms linear,
			opacity 125ms linear;
		padding: 0.125rem 0.375rem;
	}

	button:active,
	button:hover,
	button:focus {
		background-color: var(--color-highlight);
		color: var(--color-secondary-active);
	}

	button:disabled {
		background-color: var(--color-primary);
		color: var(--color-secondary);
		opacity: 50%;
		cursor: not-allowed;
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
	}

	p {
		font-family: var(--font-sans);
		font-size: 1rem;
		color: var(--color-neutral);
		text-wrap: pretty;
	}

	/* a {
		color: var(--color-primary);
		text-underline-offset: 3px;
	} */

	/* #byline {
		color: var(--color-primary);
	} */

	form {
		display: grid;
		gap: 0.25rem;
	}

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

	.update {
		transition: background-color 3s;
		background-color: transparent;
		width: fit-content;
	}

	@starting-style {
		.update {
			background-color: var(--color-light-highlight);
			background-color: rgb(from var(--color-light-highlight) r g b / 0.75);
		}
	}

	.number {
		font-variant-numeric: tabular-nums;
	}

	ul,
	menu {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	ul {
		padding-left: 0.625rem;
		font-family: var(--font-sans);

		display: grid;
		gap: 0.125rem;
	}

	menu {
		display: flex;
		gap: 0.5rem;
	}

	li.street {
		color: var(--color-neutral);
		font-size: 0.875rem;
		font-variant-numeric: tabular-nums;
	}

	ul.streets {
		padding-left: 0.625rem;
		display: grid;
		gap: 0rem;
	}

	.parenthesis {
		display: inline-block;
		padding-left: 0.125rem;
		padding-right: 0.125rem;
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

	@keyframes shake {
		0% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(5px);
		}
		50% {
			transform: translateX(-5px);
		}
		75% {
			transform: translateX(5px);
		}
		100% {
			transform: translateX(0);
		}
	}

	:global(.shake) {
		animation: shake 0.375s ease-in-out;
	}
</style>
