import type { PageServerLoad } from './$types';

const [minUsLon, minUsLat, maxUsLon, maxUsLat] = [
	-171.791110603, 18.91619, -66.96466, 71.3577635769
];

const defaultLongLat = {
	longitude: -74.006058,
	latitude: 40.712772
};

export const load: PageServerLoad = async ({ request }) => {
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
