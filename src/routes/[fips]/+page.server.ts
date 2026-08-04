import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { read } from '$app/server';
import { csvParse } from 'd3-dsv';

import stateFips from '$lib/data/fips';
import ppaUrl from '$lib/data/ppa.csv?url';

export const load: PageServerLoad = async ({ params }) => {
	const state = params.fips.substring(0, 2);

	const ppaCsv = await read(ppaUrl).text();
	const ppaOptions = csvParse<'fips' | 'name' | 'minLon' | 'minLat' | 'maxLon' | 'maxLat'>(
		ppaCsv
	).map((d) => {
		return {
			fips: d.fips,
			name: d.name,
			minLon: +d.minLon,
			minLat: +d.minLat,
			maxLon: +d.maxLon,
			maxLat: +d.maxLat
		};
	});

	const ppa = ppaOptions.find((d) => d.fips === params.fips);
	if (ppa !== undefined && Object.hasOwn(stateFips, state)) {
		return {
			state: stateFips[state as keyof typeof stateFips],
			...ppa
		};
	}

	error(404, { message: 'FIPS not found' });
};
