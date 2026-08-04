import type { Feature, MultiPolygon, Polygon } from 'geojson';
import ppa from './ppa.json';

export default ppa as Array<{
	fips: string;
	name: string;
	bbox: [number, number, number, number];
}>;

export interface PPAProperties {
	name: string;
	fips: string;
}

export type PPAFeature = Feature<Polygon | MultiPolygon, PPAProperties>;
