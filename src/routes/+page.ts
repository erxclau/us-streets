import type { PageLoad } from './$types';
import type { Feature, MultiLineString } from 'geojson';
import { deserialize } from 'flatgeobuf/lib/mjs/geojson';
import { dev } from '$app/env';
import { error } from '@sveltejs/kit';
import bboxPolygon from '@turf/bbox-polygon';
import area from '@turf/area';
// import length from '@turf/length';

// TODO: National Sub-State Geography Geodatabase
// https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-geodatabase-file.2025.html

// Roads National Geodatabase
// https://www2.census.gov/geo/pdfs/maps-data/data/tiger/tgrshp2025/2025_TIGERLINE_GDB_Record_Layouts.pdf

// https://www2.census.gov/geo/pdfs/maps-data/data/tiger/tgrshp2025/TGRSHP2025_TechDoc_B.pdf
// https://www2.census.gov/geo/pdfs/maps-data/data/tiger/tgrshp2025/TGRSHP2025_TechDoc_C.pdf
// https://www2.census.gov/geo/pdfs/maps-data/data/tiger/tgrshp2025/TGRSHP2025_TechDoc_D.pdf

interface RoadProperties {
	LINEARID: string; // Linear feature identifier
	FULLNAME: string; // Concatenation of expanded text for prefix qualifier, prefix direction, prefix type, base name, suffix type, suffix direction, and suffix qualifier (as available) with a space between each expanded text field
	RTTYP: string; // Route type code
	MTFCC: string; // MAF/TIGER feature class code
	PREQUAL?: string; // Expanded text for prefix qualifier (as available)
	PREDIR?: string; // Expanded text for prefix direction (as available)
	PRETYP?: string; // Expanded text for prefix type (as available)
	NAME: string; // Base name
	SUFTYP?: string; // Expanded text for suffix type (as available)
	SUFDIR?: string; // Expanded text for suffix direction (as available)
	SUFQUAL?: string; // Expanded text for suffix qualifier (as available)
}

type RoadFeature = Feature<MultiLineString, RoadProperties>;

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

	const polygon = bboxPolygon(coordinates as [number, number, number, number]);
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

			if (dev) {
				if (!features.every((d) => d.geometry.type === 'MultiLineString')) {
					console.error(features.filter((d) => d.geometry.type !== 'MultiLineString'));
					throw new Error('Features with non-MultiLineString geometry type');
				}
			}

			return features;
		})(),
		bbox: {
			coordinates: bbox,
			polygon
		}
	};
};
