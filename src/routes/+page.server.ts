import type { PageServerLoad } from './$types';
import type { Feature, MultiLineString } from 'geojson';
import { deserialize } from 'flatgeobuf/lib/mjs/geojson';
import { dev } from '$app/env';
import { error } from '@sveltejs/kit';

// https://www2.census.gov/geo/pdfs/maps-data/data/tiger/tgrshp2025/2025_TIGERLINE_GDB_Record_Layouts.pdf
// Page 16: Roads National Geodatabase

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

export const load: PageServerLoad = async () => {
	const bbox = {
		minX: -74.045633,
		minY: 40.680694,
		maxX: -73.905651,
		maxY: 40.881714
	};

	const fgb = deserialize('https://r2.erxclau.me/us.fgb', bbox) as AsyncGenerator<RoadFeature>;
	const features = await Array.fromAsync(fgb);

	if (dev) {
		if (!features.every((d) => d.geometry.type === 'MultiLineString')) {
			console.error(features.filter((d) => d.geometry.type !== 'MultiLineString'));
			error(400, {
				message: `Features with non-MultiLineString geometry type`
			});
		}
	}

	return { features, bbox };
};
