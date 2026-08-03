import { error } from '@sveltejs/kit';
import { dev } from '$app/env';
import { deserialize } from 'flatgeobuf/lib/mjs/geojson';
import bboxPolygon from '@turf/bbox-polygon';
import bboxClip from '@turf/bbox-clip';
import area from '@turf/area';

import type { PageLoad } from './$types';
import type { RoadFeature } from '$lib/tiger';

// TODO: National Sub-State Geography Geodatabase
// https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-geodatabase-file.2025.html

type BBoxCoordinates = [number, number, number, number];

export const ssr = false;

export const load: PageLoad = async ({ url }) => {
	const bboxParam =
		url.searchParams.get('bbox') ??
		'-74.25495722091921,40.49787772944257,-73.70000924119739,40.91510284353152';
	const coordinates = bboxParam.split(',').map((d) => Number(d));

	if (coordinates.length !== 4 || coordinates.some((d) => isNaN(d))) {
		error(400, {
			message: 'Could not parse bbox from search parameters'
		});
	}

	const bbox = {
		minX: coordinates[0],
		minY: coordinates[1],
		maxX: coordinates[2],
		maxY: coordinates[3]
	};

	const polygon = bboxPolygon(coordinates as BBoxCoordinates);
	const bboxAreaSqKm = area(polygon) / 1_000_000;

	if (bboxAreaSqKm > 3_000) {
		error(400, {
			message: 'Provided bbox is larger than 3000 sq km'
		});
	}

	let fgb: AsyncGenerator<RoadFeature>;

	try {
		fgb = deserialize(
			dev ? '/us.fgb' : 'https://r2.erxclau.me/us.fgb',
			bbox
		) as AsyncGenerator<RoadFeature>;
	} catch (err) {
		error(400, {
			message: String(err)
		});
	}

	return {
		features: (async () => {
			const features = await Array.fromAsync(fgb);

			if (features.length === 0) {
				throw new Error('Provided bbox contains no U.S. streets');
			}

			return features.map((f) => bboxClip(f, coordinates as BBoxCoordinates)) as Array<RoadFeature>;
		})(),
		bbox: {
			coordinates: bbox,
			polygon
		}
	};
};
