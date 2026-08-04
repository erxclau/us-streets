import ppa from './ppa.json';

export default ppa as Array<{
	fips: string;
	name: string;
	bbox: [number, number, number, number];
}>;
