import { error } from '@sveltejs/kit';
import { dev } from '$app/env';
import { deserialize } from 'flatgeobuf/lib/mjs/geojson';

import type { PageLoad } from './$types';
import type { RoadFeature } from '$lib/tiger';
import type { PPAFeature } from '$lib/data/ppa';
import bboxClip from '@turf/bbox-clip';

export const ssr = false;

export const load: PageLoad = async ({ data, params }) => {
	const coordinates = {
		minX: data.bbox[0],
		minY: data.bbox[1],
		maxX: data.bbox[2],
		maxY: data.bbox[3]
	};

	let ppaFgb: AsyncGenerator<PPAFeature>;
	try {
		ppaFgb = deserialize(
			dev ? '/ppa.fgb' : 'https://r2.erxclau.me/ppa.fgb',
			coordinates
		) as AsyncGenerator<PPAFeature>;
	} catch (err) {
		error(400, {
			message: String(err)
		});
	}

	let ppa: PPAFeature | undefined = undefined;
	for await (const f of ppaFgb) {
		if (f.properties.fips === params.fips) {
			ppa = f;
			break;
		}
	}

	if (ppa === undefined) {
		error(400, {
			message: 'Could not resolve PPA'
		});
	}

	let roadsFgb: AsyncGenerator<RoadFeature>;
	try {
		roadsFgb = deserialize(
			dev ? '/us.fgb' : 'https://r2.erxclau.me/us.fgb',
			coordinates
		) as AsyncGenerator<RoadFeature>;
	} catch (err) {
		error(400, {
			message: String(err)
		});
	}

	return {
		server: data,
		features: (async () => {
			const features = await Array.fromAsync(roadsFgb);

			if (features.length === 0) {
				throw new Error('Provided bbox contains no U.S. streets');
			}

			// TODO: clip to ppa bounds
			return features.map((f) => bboxClip(f, data.bbox)) as Array<RoadFeature>;
		})(),
		bbox: {
			coordinates,
			polygon: ppa
		}
	};
};
