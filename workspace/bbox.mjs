// node workspace/bbox.mjs

import { deserialize } from 'flatgeobuf/lib/mjs/geojson.js';
import { readFileSync, writeFileSync } from 'fs';
import { bbox as turfBBox } from '@turf/bbox';

const data = readFileSync('./workspace/ppa.fgb');
const view = new Uint8Array(data.buffer);
const fgb = deserialize(view);

const mapping = {};

for await (const feature of fgb) {
	const bbox = turfBBox(feature);
	mapping[feature.properties.fips] = bbox;
}

writeFileSync('./workspace/ppa-bbox.json', JSON.stringify(mapping));
