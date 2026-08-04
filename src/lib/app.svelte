<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { resolve } from '$app/paths';

	import { Map as MapboxMap, type FeatureSelector } from 'mapbox-gl/esm';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import type { Feature, GeoJsonProperties, Geometry } from 'geojson';
	import length from '@turf/length';
	import { ascending, sum } from 'd3-array';
	import { Toaster, toast, type ToastOptions } from 'svelte-sonner';

	import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';
	import { formatFeatureName, matchFeature, type RoadFeature } from './tiger';
	import Details from './details.svelte';
	import H1 from './h1.svelte';
	import Input from './input.svelte';

	interface Props {
		features: Array<RoadFeature>;
		bbox: {
			coordinates: {
				minX: number;
				minY: number;
				maxX: number;
				maxY: number;
			};
			polygon: Feature<Geometry, GeoJsonProperties>;
		};
		name?: string;
		state?: { name: string; postal: string };
		fips?: string;
	}

	let { bbox, features, name: placeName, state: usState, fips }: Props = $props();

	const totalMiles = $derived(sum(features, (d) => length(d, { units: 'miles' })));

	const bboxCoordinates = $derived(
		`${bbox.coordinates.minX},${bbox.coordinates.minY},${bbox.coordinates.maxX},${bbox.coordinates.maxY}`
	);

	const modalId = 'confirm-reset-progress';
	const localStoragePlaceKey = $derived(fips === undefined ? bboxCoordinates : fips);
	const localStorageRequireDirectionKey = 'us-streets.require-direction';
	const localStorageRequireDirectionToastKey = 'us-streets.require-direction-toast';

	const toastOptions: ToastOptions = {
		unstyled: true,
		classes: {
			toast: 'toast',
			title: 'toast-title',
			closeButton: 'toast-close-button'
		}
	};

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

	let requireDirection = $state<boolean | undefined>(undefined);
	let requireDirectionToast = $state<boolean>(true);

	onMount(() => {
		const localLinearIds = localStorage.getItem(localStoragePlaceKey);
		if (localLinearIds !== null) {
			let json: Array<string> = [];
			try {
				json = JSON.parse(localLinearIds);
			} catch (e) {
				console.error(e);
			}

			if (Array.isArray(json)) {
				linearIds = new SvelteSet(json);
			}
		}

		const localRequireDirection = localStorage.getItem(localStorageRequireDirectionKey);
		if (localRequireDirection !== null) {
			let value: boolean | undefined = undefined;
			try {
				value = JSON.parse(localRequireDirection);
			} catch (e) {
				console.error(e);
			}

			requireDirection = value;
			if (requireDirection === false) {
				requireDirectionToast = false;
			}
		}

		const localRequireDirectionToast = localStorage.getItem(localStorageRequireDirectionToastKey);
		if (localRequireDirectionToast !== null) {
			let value: boolean | undefined = undefined;
			try {
				value = JSON.parse(localRequireDirectionToast);
			} catch (e) {
				console.error(e);
			}

			requireDirectionToast = value ?? true;
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
					'line-width': 1.25
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
		localStorage.setItem(localStoragePlaceKey, JSON.stringify(Array.from(linearIds)));
	});

	$effect(() => {
		if (requireDirection !== undefined) {
			localStorage.setItem(localStorageRequireDirectionKey, JSON.stringify(requireDirection));
			if (requireDirection === false) {
				requireDirectionToast = false;
				toast.dismiss();
			}
		}
	});

	$effect(() => {
		localStorage.setItem(
			localStorageRequireDirectionToastKey,
			JSON.stringify(requireDirectionToast)
		);
	});
</script>

<main>
	<hgroup>
		<div id="form">
			<div
				style="display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; font-size: 1rem; gap: 0.125rem"
			>
				<H1 />
				<a href="{resolve('/')}?from={bboxCoordinates}">Change place</a>
			</div>

			<form
				onsubmit={async (e) => {
					toast.dismiss();

					e.preventDefault();
					const formData = new FormData(e.currentTarget);
					const attemptData = formData.get('attempt');

					if (!attemptData) {
						return;
					}

					const attempt = attemptData.toString().toLowerCase().trim();
					const matchedFeatures = features.filter((f) =>
						matchFeature(f, attempt, {
							requireDirection: requireDirection || requireDirection === undefined
						})
					);

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

					if ((requireDirection || requireDirection === undefined) && requireDirectionToast) {
						const matchDirectionlessFeatures = features.filter((f) =>
							matchFeature(f, attempt, {
								requireDirection: false
							})
						);

						if (matchDirectionlessFeatures.length > 0) {
							const message =
								'Street directions are required. You can turn off the requirement in the settings.';

							toast(message, {
								duration: Number.POSITIVE_INFINITY
							});

							requireDirectionToast = false;
						}
					}

					input.classList.remove('shake');
					await tick();
					input.classList.add('shake');
				}}
			>
				{#if placeName !== undefined && usState !== undefined}
					<Input
						place={{
							name: placeName,
							state: usState
						}}
					/>
				{:else}
					<Input />
				{/if}
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

					<div style="display: flex; flex-wrap: wrap; flex-direction: column; gap: 0.5rem;">
						<div class="checkbox">
							<input
								type="checkbox"
								name="require-direction"
								id="require-direction"
								bind:checked={requireDirection}
								defaultChecked
							/>
							<label for="require-direction">Require direction</label>
						</div>

						<div>
							<button command="show-modal" commandfor={modalId} disabled={linearIds.size === 0}
								>Reset progress</button
							>
						</div>
					</div>

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
			</details>
		</div>
	</hgroup>

	<figure>
		<div id="map" bind:this={ref}></div>
	</figure>

	<div class="mobile-toaster">
		<Toaster position="bottom-center" closeButton {toastOptions} />
	</div>
	<div class="desktop-toaster">
		<Toaster position="bottom-right" closeButton {toastOptions} />
	</div>
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
	button,
	:global(.toast-close-button) {
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

	button,
	:global(.toast-close-button) {
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
	button:focus,
	:global(.toast-close-button:active, .toast-close-button:hover, .toast-close-button:focus) {
		background-color: var(--color-highlight);
		color: var(--color-secondary-active);
	}

	button:disabled,
	:global(.toast-close-button:disabled) {
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

	.mobile-toaster {
		display: none;
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

		.mobile-toaster {
			display: block;
		}

		.desktop-toaster {
			display: none;
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

	.checkbox {
		display: flex;
		gap: 0.25rem;
		align-items: center;
	}

	input[type='checkbox'] {
		margin: 0;
		accent-color: var(--color--dark-highlight);
	}

	label {
		font-family: var(--font-sans);
		font-size: 0.875rem;
		color: var(--color-neutral);
	}

	a {
		color: var(--color-neutral);
		text-underline-offset: 3px;
		font-family: var(--font-sans);
		transition: color 125ms linear;
		font-size: 0.925rem;
	}

	a:hover,
	a:focus,
	a:active {
		color: var(--color-primary);
	}

	form {
		display: grid;
		gap: 0.25rem;
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

	:global(.toast-title) {
		font-family: var(--font-sans);
		font-size: 0.875rem;
		line-height: 1.125rem;
	}

	:global(.toast) {
		padding: 0.875rem;
		box-shadow: 0 0 1px 1px rgb(from var(--color-neutral) r g b / 0.25);
		border-radius: 0.375rem;
		background-color: var(--color-secondary);
		width: 100%;
		box-sizing: border-box;
		max-width: 400px;
	}

	:global(.toast-close-button) {
		--size: 20px;
		width: var(--size);
		height: var(--size);
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 1rem;
		border-radius: 100%;
		position: absolute;
		top: calc(-0.25 * var(--size));
		left: calc(-0.25 * var(--size));
	}

	:global(.toast-close-button svg) {
		transform: scale(1.5);
	}
</style>
