import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = () => {
	return {
		number: new Promise<number>((res) => {
			setTimeout(() => res(1000), 500);
		})
	};
};
