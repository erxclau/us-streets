import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

import stateFips from '$lib/data/fips';
import ppaOptions from '$lib/data/ppa';

export const load: PageServerLoad = async ({ params }) => {
	const state = params.fips.substring(0, 2);

	const ppa = ppaOptions.find((d) => d.fips === params.fips);
	if (ppa !== undefined && Object.hasOwn(stateFips, state)) {
		return {
			state: stateFips[state as keyof typeof stateFips],
			...ppa
		};
	}

	error(404, { message: 'FIPS not found' });
};
