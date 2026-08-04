import type { PageServerLoad } from './$types';
import { minUsLat, maxUsLon, minUsLon, maxUsLat } from '$lib/data/us-bbox';

const defaultLongLat = {
	longitude: -74.006058,
	latitude: 40.712772
};

export const load: PageServerLoad = async ({ request, url }) => {
	const fromParam = url.searchParams.get('from');
	if (fromParam !== null) {
		const fromCoordinates = fromParam.split(',').map((d) => Number(d));
		if (fromCoordinates.length === 4 || fromCoordinates.every((d) => !isNaN(d))) {
			const [fromMinLon, fromMinLat, fromMaxLon, fromMaxLat] = fromCoordinates;
			return {
				location: {
					longitude: (fromMinLon + fromMaxLon) / 2,
					latitude: (fromMinLat + fromMaxLat) / 2
				}
			};
		}
	}

	if (request.cf && request.cf.longitude && request.cf.latitude) {
		const longitude = +request.cf.longitude;
		const latitude = +request.cf.latitude;

		if (isNaN(longitude) || isNaN(latitude)) {
			return { location: defaultLongLat };
		}

		if (
			longitude >= minUsLon &&
			longitude <= maxUsLon &&
			latitude >= minUsLat &&
			latitude <= maxUsLat
		) {
			return {
				location: {
					longitude,
					latitude
				}
			};
		}
	}

	return { location: defaultLongLat };
};
