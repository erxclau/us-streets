// node workspace/ppa.mjs

import { deserialize } from 'flatgeobuf/lib/mjs/geojson.js';
import { readFileSync, writeFileSync } from 'fs';
import { bbox as turfBBox } from '@turf/bbox';

const data = readFileSync('./workspace/ppa.fgb');
const view = new Uint8Array(data.buffer);
const fgb = deserialize(view);

const mapping = [];
for await (const feature of fgb) {
	const [minLon, minLat, maxLon, maxLat] = turfBBox(feature);
	mapping.push({
		fips: feature.properties.fips,
		name: feature.properties.name,
		bbox: [minLon, minLat, maxLon, maxLat]
	});
}

writeFileSync('./workspace/ppa.json', JSON.stringify(mapping));
