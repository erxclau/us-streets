// Roads National Geodatabase
// https://www2.census.gov/geo/pdfs/maps-data/data/tiger/tgrshp2025/2025_TIGERLINE_GDB_Record_Layouts.pdf

import type { Feature, LineString, MultiLineString } from 'geojson';

export type RoadFeature = Feature<MultiLineString | LineString, RoadProperties>;

interface RoadProperties {
	LINEARID: string; // Linear feature identifier
	FULLNAME: string; // Concatenation of expanded text for prefix qualifier, prefix direction, prefix type, base name, suffix type, suffix direction, and suffix qualifier (as available) with a space between each expanded text field
	RTTYP: string; // Route type code
	MTFCC: string; // MAF/TIGER feature class code
	PREQUAL?: keyof PrefixQualifiers; // Expanded text for prefix qualifier (as available)
	PREDIR?: keyof typeof directions; // Expanded text for prefix direction (as available)
	PRETYP?: keyof PrefixTypes; // Expanded text for prefix type (as available)
	NAME: string; // Base name
	SUFTYP?: keyof SuffixTypes; // Expanded text for suffix type (as available)
	SUFDIR?: keyof typeof directions; // Expanded text for suffix direction (as available)
	SUFQUAL?: keyof SuffixQualifiers; // Expanded text for suffix qualifier (as available)
}

interface Text {
	expandedFullText: string;
}

interface TranslatableText extends Text {
	spanishTranslation: string | undefined;
}

// https://www2.census.gov/geo/pdfs/maps-data/data/tiger/tgrshp2025/TGRSHP2025_TechDoc_B.pdf
interface Direction extends TranslatableText {
	directionalAbbreviation: string;
}

const directions = {
	'11': {
		expandedFullText: 'North',
		directionalAbbreviation: 'N',
		spanishTranslation: undefined
	},
	'12': {
		expandedFullText: 'South',
		directionalAbbreviation: 'S',
		spanishTranslation: undefined
	},
	'13': {
		expandedFullText: 'East',
		directionalAbbreviation: 'E',
		spanishTranslation: undefined
	},
	'14': {
		expandedFullText: 'West',
		directionalAbbreviation: 'W',
		spanishTranslation: undefined
	},
	'15': {
		expandedFullText: 'Northeast',
		directionalAbbreviation: 'NE',
		spanishTranslation: undefined
	},
	'16': {
		expandedFullText: 'Northwest',
		directionalAbbreviation: 'NW',
		spanishTranslation: undefined
	},
	'17': {
		expandedFullText: 'Southeast',
		directionalAbbreviation: 'SE',
		spanishTranslation: undefined
	},
	'18': {
		expandedFullText: 'Southwest',
		directionalAbbreviation: 'SW',
		spanishTranslation: undefined
	},
	'19': {
		expandedFullText: 'Norte',
		directionalAbbreviation: 'N',
		spanishTranslation: 'North'
	},
	'20': {
		expandedFullText: 'Sur',
		directionalAbbreviation: 'S',
		spanishTranslation: 'South'
	},
	'21': {
		expandedFullText: 'Este',
		directionalAbbreviation: 'E',
		spanishTranslation: 'East'
	},
	'22': {
		expandedFullText: 'Oeste',
		directionalAbbreviation: 'O',
		spanishTranslation: 'West'
	},
	'23': {
		expandedFullText: 'Noreste',
		directionalAbbreviation: 'NE',
		spanishTranslation: 'Northeast'
	},
	'24': {
		expandedFullText: 'Noroeste',
		directionalAbbreviation: 'NO',
		spanishTranslation: 'Northwest'
	},
	'25': {
		expandedFullText: 'Sudeste',
		directionalAbbreviation: 'SE',
		spanishTranslation: 'Southeast'
	},
	'26': {
		expandedFullText: 'Sudoeste',
		directionalAbbreviation: 'SO',
		spanishTranslation: 'Southwest'
	}
} as const satisfies Record<string, Direction>;

interface AffixableText extends Text {
	prefix: boolean;
	suffix: boolean;
}

type PositionalPick<T extends Record<string, AffixableText>, V extends keyof AffixableText> = {
	[K in keyof T as T[K][V] extends true ? K : never]: T[K];
};

// https://www2.census.gov/geo/pdfs/maps-data/data/tiger/tgrshp2025/TGRSHP2025_TechDoc_C.pdf
interface Qualifier extends AffixableText {
	displayNameAbbreviation: string;
}

const qualifiers = {
	'11': { expandedFullText: 'Access', displayNameAbbreviation: 'Acc', prefix: false, suffix: true },
	'12': {
		expandedFullText: 'Alternate',
		displayNameAbbreviation: 'Alt',
		prefix: true,
		suffix: true
	},
	'13': {
		expandedFullText: 'Business',
		displayNameAbbreviation: 'Bus',
		prefix: true,
		suffix: true
	},
	'14': { expandedFullText: 'Bypass', displayNameAbbreviation: 'Byp', prefix: true, suffix: true },
	'15': {
		expandedFullText: 'Connector',
		displayNameAbbreviation: 'Con',
		prefix: false,
		suffix: true
	},
	'16': {
		expandedFullText: 'Extended',
		displayNameAbbreviation: 'Exd',
		prefix: true,
		suffix: true
	},
	'17': {
		expandedFullText: 'Extension',
		displayNameAbbreviation: 'Exn',
		prefix: false,
		suffix: true
	},
	'18': {
		expandedFullText: 'Historic',
		displayNameAbbreviation: 'Hst',
		prefix: true,
		suffix: false
	},
	'19': { expandedFullText: 'Loop', displayNameAbbreviation: 'Lp', prefix: true, suffix: true },
	'20': { expandedFullText: 'Old', displayNameAbbreviation: 'Old', prefix: true, suffix: false },
	'21': { expandedFullText: 'Private', displayNameAbbreviation: 'Pvt', prefix: true, suffix: true },
	'22': { expandedFullText: 'Public', displayNameAbbreviation: 'Pub', prefix: true, suffix: true },
	'23': { expandedFullText: 'Scenic', displayNameAbbreviation: 'Scn', prefix: false, suffix: true },
	'24': { expandedFullText: 'Spur', displayNameAbbreviation: 'Spr', prefix: true, suffix: true },
	'25': { expandedFullText: 'Ramp', displayNameAbbreviation: 'Rmp', prefix: false, suffix: true },
	'26': {
		expandedFullText: 'Underpass',
		displayNameAbbreviation: 'Unp',
		prefix: false,
		suffix: true
	},
	'27': {
		expandedFullText: 'Overpass',
		displayNameAbbreviation: 'Ovp',
		prefix: false,
		suffix: true
	}
} as const satisfies Record<string, Qualifier>;

type PrefixQualifiers = PositionalPick<typeof qualifiers, 'prefix'>;
type SuffixQualifiers = PositionalPick<typeof qualifiers, 'suffix'>;

// https://www2.census.gov/geo/pdfs/maps-data/data/tiger/tgrshp2025/TGRSHP2025_TechDoc_D.pdf
interface Type extends AffixableText, TranslatableText {
	displayNameAbbreviation: string;
}

const types = {
	'103': {
		expandedFullText: 'Academy',
		displayNameAbbreviation: 'Acdmy',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'104': {
		expandedFullText: 'Acueducto',
		displayNameAbbreviation: 'Acueducto',
		spanishTranslation: 'Aqueduct',
		prefix: true,
		suffix: false
	},
	'105': {
		expandedFullText: 'Aeropuerto',
		displayNameAbbreviation: 'Aero',
		spanishTranslation: 'Airport',
		prefix: true,
		suffix: false
	},
	'106': {
		expandedFullText: 'Air Force Base',
		displayNameAbbreviation: 'AFB',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'107': {
		expandedFullText: 'Airfield',
		displayNameAbbreviation: 'Airfield',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'108': {
		expandedFullText: 'Airpark',
		displayNameAbbreviation: 'Airpark',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'109': {
		expandedFullText: 'Airport',
		displayNameAbbreviation: 'Arprt',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'110': {
		expandedFullText: 'Airstrip',
		displayNameAbbreviation: 'Airstrip',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'112': {
		expandedFullText: 'Alley',
		displayNameAbbreviation: 'Aly',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'115': {
		expandedFullText: 'Apartment Building',
		displayNameAbbreviation: 'Apt Bldg',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'116': {
		expandedFullText: 'Apartment Complex',
		displayNameAbbreviation: 'Apt Complex',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'117': {
		expandedFullText: 'Apartments',
		displayNameAbbreviation: 'Apts',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'118': {
		expandedFullText: 'Aqueduct',
		displayNameAbbreviation: 'Aqueduct',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'119': {
		expandedFullText: 'Arcade',
		displayNameAbbreviation: 'Arc',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'121': {
		expandedFullText: 'Arroyo',
		displayNameAbbreviation: 'Arroyo',
		spanishTranslation: 'Stream',
		prefix: true,
		suffix: false
	},
	'122': {
		expandedFullText: 'Assisted Living Center',
		displayNameAbbreviation: 'Asstd Liv Ctr',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'694': {
		expandedFullText: 'Assisted Living Facility',
		displayNameAbbreviation: 'Asstd Liv Fac',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'123': {
		expandedFullText: 'Autopista',
		displayNameAbbreviation: 'Autopista',
		spanishTranslation: 'Expressway or Freeway',
		prefix: true,
		suffix: false
	},
	'124': {
		expandedFullText: 'Avenida',
		displayNameAbbreviation: 'Ave',
		spanishTranslation: 'Avenue',
		prefix: true,
		suffix: false
	},
	'125': {
		expandedFullText: 'Avenue',
		displayNameAbbreviation: 'Ave',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'126': {
		expandedFullText: 'Bahia',
		displayNameAbbreviation: 'Bahía',
		spanishTranslation: 'Bay',
		prefix: true,
		suffix: false
	},
	'127': {
		expandedFullText: 'Bank',
		displayNameAbbreviation: 'Bk',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'704': {
		expandedFullText: 'Base',
		displayNameAbbreviation: 'Base',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'128': {
		expandedFullText: 'Basin',
		displayNameAbbreviation: 'Basin',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'129': {
		expandedFullText: 'Bay',
		displayNameAbbreviation: 'Bay',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'130': {
		expandedFullText: 'Bayou',
		displayNameAbbreviation: 'Byu',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'131': {
		expandedFullText: 'Beach',
		displayNameAbbreviation: 'Bch',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'132': {
		expandedFullText: 'Bed and Breakfast',
		displayNameAbbreviation: 'B and B',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'136': {
		expandedFullText: 'Beltway',
		displayNameAbbreviation: 'Beltway',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'137': {
		expandedFullText: 'Bend',
		displayNameAbbreviation: 'Bnd',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'138': {
		expandedFullText: 'Bluff',
		displayNameAbbreviation: 'Blf',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'139': {
		expandedFullText: 'Boarding House',
		displayNameAbbreviation: 'Brdng Hse',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'140': {
		expandedFullText: 'Bog',
		displayNameAbbreviation: 'Bog',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'141': {
		expandedFullText: 'Bosque',
		displayNameAbbreviation: 'Bosque',
		spanishTranslation: 'Forest',
		prefix: true,
		suffix: false
	},
	'142': {
		expandedFullText: 'Boulevard',
		displayNameAbbreviation: 'Blvd',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'143': {
		expandedFullText: 'Boundary',
		displayNameAbbreviation: 'Boundary',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'146': {
		expandedFullText: 'Branch',
		displayNameAbbreviation: 'Br',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'147': {
		expandedFullText: 'Bridge',
		displayNameAbbreviation: 'Brg',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'148': {
		expandedFullText: 'Brook',
		displayNameAbbreviation: 'Brk',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'149': {
		expandedFullText: 'Building',
		displayNameAbbreviation: 'Bldg',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'150': {
		expandedFullText: 'Bulevar',
		displayNameAbbreviation: 'Bulevar',
		spanishTranslation: 'Boulevard',
		prefix: true,
		suffix: false
	},
	'151': {
		expandedFullText: 'Bureau of Indian Affairs Highway',
		displayNameAbbreviation: 'BIA Hwy',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'152': {
		expandedFullText: 'Bureau of Indian Affairs Road',
		displayNameAbbreviation: 'BIA Rd',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'153': {
		expandedFullText: 'Bureau of Indian Affairs Route',
		displayNameAbbreviation: 'BIA Rte',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'154': {
		expandedFullText: 'Bureau of Land Management Road',
		displayNameAbbreviation: 'BLM Rd',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'696': {
		expandedFullText: 'Bypass',
		displayNameAbbreviation: 'Byp',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'156': {
		expandedFullText: 'Calle',
		displayNameAbbreviation: 'Cll',
		spanishTranslation: 'Street',
		prefix: true,
		suffix: false
	},
	'157': {
		expandedFullText: 'Calleja',
		displayNameAbbreviation: 'Calleja',
		spanishTranslation: 'Narrow Street',
		prefix: true,
		suffix: false
	},
	'158': {
		expandedFullText: 'Callejón',
		displayNameAbbreviation: 'Callejón',
		spanishTranslation: 'Alley',
		prefix: true,
		suffix: false
	},
	'159': {
		expandedFullText: 'Caminito',
		displayNameAbbreviation: 'Cmt',
		spanishTranslation: 'Little Road',
		prefix: true,
		suffix: false
	},
	'160': {
		expandedFullText: 'Camino',
		displayNameAbbreviation: 'Cam',
		spanishTranslation: 'Road or Way',
		prefix: true,
		suffix: false
	},
	'161': {
		expandedFullText: 'Camp',
		displayNameAbbreviation: 'Cp',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'163': {
		expandedFullText: 'Campground',
		displayNameAbbreviation: 'Cmpgrnd',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'164': {
		expandedFullText: 'Campus',
		displayNameAbbreviation: 'Cmps',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'165': {
		expandedFullText: 'Canal',
		displayNameAbbreviation: 'Cnl',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'172': {
		expandedFullText: 'Cano',
		displayNameAbbreviation: 'Caño',
		spanishTranslation: 'Drain or Sewer',
		prefix: true,
		suffix: false
	},
	'166': {
		expandedFullText: 'Cantera',
		displayNameAbbreviation: 'Cantera',
		spanishTranslation: 'Quarry or Gravel Pit',
		prefix: true,
		suffix: false
	},
	'167': {
		expandedFullText: 'Canyon',
		displayNameAbbreviation: 'Cyn',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'168': {
		expandedFullText: 'Capilla',
		displayNameAbbreviation: 'Capilla',
		spanishTranslation: 'Chapel',
		prefix: true,
		suffix: false
	},
	'169': {
		expandedFullText: 'Carretera',
		displayNameAbbreviation: 'Carr',
		spanishTranslation: 'Road',
		prefix: true,
		suffix: false
	},
	'170': {
		expandedFullText: 'Causeway',
		displayNameAbbreviation: 'Cswy',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'171': {
		expandedFullText: 'Cayo',
		displayNameAbbreviation: 'Cayo',
		spanishTranslation: 'Key',
		prefix: true,
		suffix: false
	},
	'173': {
		expandedFullText: 'Cementerio',
		displayNameAbbreviation: 'Cem',
		spanishTranslation: 'Cemetery',
		prefix: true,
		suffix: false
	},
	'174': {
		expandedFullText: 'Cemetery',
		displayNameAbbreviation: 'Cmtry',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'175': {
		expandedFullText: 'Center',
		displayNameAbbreviation: 'Ctr',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'176': {
		expandedFullText: 'Centro',
		displayNameAbbreviation: 'Centro',
		spanishTranslation: 'Center',
		prefix: true,
		suffix: false
	},
	'177': {
		expandedFullText: 'Cerrada',
		displayNameAbbreviation: 'Cer',
		spanishTranslation: 'Closed',
		prefix: true,
		suffix: false
	},
	'178': {
		expandedFullText: 'Chamber of Commerce',
		displayNameAbbreviation: 'Cham of Com',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'179': {
		expandedFullText: 'Channel',
		displayNameAbbreviation: 'Chnnl',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'180': {
		expandedFullText: 'Chapel',
		displayNameAbbreviation: 'Cpl',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'181': {
		expandedFullText: 'Childrens Home',
		displayNameAbbreviation: 'Childrens Home',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'182': {
		expandedFullText: 'Church',
		displayNameAbbreviation: 'Church',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'183': {
		expandedFullText: 'Circle',
		displayNameAbbreviation: 'Cir',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'234': {
		expandedFullText: 'Círculo',
		displayNameAbbreviation: 'Cír',
		spanishTranslation: 'Circle',
		prefix: true,
		suffix: false
	},
	'184': {
		expandedFullText: 'City Hall',
		displayNameAbbreviation: 'City Hall',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'185': {
		expandedFullText: 'City Park',
		displayNameAbbreviation: 'City Park',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'186': {
		expandedFullText: 'Cliff',
		displayNameAbbreviation: 'Clf',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'187': {
		expandedFullText: 'Club',
		displayNameAbbreviation: 'Clb',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'188': {
		expandedFullText: 'Colegio',
		displayNameAbbreviation: 'Colegio',
		spanishTranslation: 'School',
		prefix: true,
		suffix: false
	},
	'189': {
		expandedFullText: 'College',
		displayNameAbbreviation: 'Colg',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'190': {
		expandedFullText: 'Common',
		displayNameAbbreviation: 'Cmn',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'191': {
		expandedFullText: 'Commons',
		displayNameAbbreviation: 'Cmns',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'192': {
		expandedFullText: 'Community Center',
		displayNameAbbreviation: 'Community Ctr',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'193': {
		expandedFullText: 'Community College',
		displayNameAbbreviation: 'Community Colg',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'194': {
		expandedFullText: 'Community Park',
		displayNameAbbreviation: 'Community Park',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'195': {
		expandedFullText: 'Complex',
		displayNameAbbreviation: 'Complx',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'197': {
		expandedFullText: 'Condominios',
		displayNameAbbreviation: 'Condios',
		spanishTranslation: 'Condominiums',
		prefix: true,
		suffix: false
	},
	'198': {
		expandedFullText: 'Condominium',
		displayNameAbbreviation: 'Condo',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'199': {
		expandedFullText: 'Condominiums',
		displayNameAbbreviation: 'Condos',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'201': {
		expandedFullText: 'Convent',
		displayNameAbbreviation: 'Cnvnt',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'202': {
		expandedFullText: 'Convention Center',
		displayNameAbbreviation: 'Convention Ctr',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'203': {
		expandedFullText: 'Corners',
		displayNameAbbreviation: 'Cors',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'204': {
		expandedFullText: 'Correctional Facility',
		displayNameAbbreviation: 'Corr Faclty',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'205': {
		expandedFullText: 'Correctional Institute',
		displayNameAbbreviation: 'Corr Inst',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'207': {
		expandedFullText: 'Corte',
		displayNameAbbreviation: 'Corte',
		spanishTranslation: 'Court',
		prefix: true,
		suffix: false
	},
	'679': {
		expandedFullText: 'Cottage',
		displayNameAbbreviation: 'Cottage',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'208': {
		expandedFullText: 'Coulee',
		displayNameAbbreviation: 'Coulee',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'209': {
		expandedFullText: 'Country Club',
		displayNameAbbreviation: 'Country Club',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'210': {
		expandedFullText: 'County Highway',
		displayNameAbbreviation: 'Co Hwy',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'211': {
		expandedFullText: 'County Home',
		displayNameAbbreviation: 'Co Home',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'212': {
		expandedFullText: 'County Lane',
		displayNameAbbreviation: 'Co Ln',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'213': {
		expandedFullText: 'County Park',
		displayNameAbbreviation: 'Co Park',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'214': {
		expandedFullText: 'County Road',
		displayNameAbbreviation: 'Co Rd',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'215': {
		expandedFullText: 'County Route',
		displayNameAbbreviation: 'Co Rte',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'216': {
		expandedFullText: 'County State Aid Highway',
		displayNameAbbreviation: 'Co St Aid Hwy',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'217': {
		expandedFullText: 'County Trunk Highway',
		displayNameAbbreviation: 'Co Trunk Hwy',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'218': {
		expandedFullText: 'County Trunk Road',
		displayNameAbbreviation: 'Co Trunk Rd',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'219': {
		expandedFullText: 'Course',
		displayNameAbbreviation: 'Crs',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'220': {
		expandedFullText: 'Court',
		displayNameAbbreviation: 'Ct',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'221': {
		expandedFullText: 'Courthouse',
		displayNameAbbreviation: 'Courthouse',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'222': {
		expandedFullText: 'Courts',
		displayNameAbbreviation: 'Cts',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'223': {
		expandedFullText: 'Cove',
		displayNameAbbreviation: 'Cv',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'225': {
		expandedFullText: 'Creek',
		displayNameAbbreviation: 'Crk',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'226': {
		expandedFullText: 'Crescent',
		displayNameAbbreviation: 'Cres',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'227': {
		expandedFullText: 'Crest',
		displayNameAbbreviation: 'Crst',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'228': {
		expandedFullText: 'Crossing',
		displayNameAbbreviation: 'Xing',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'229': {
		expandedFullText: 'Crossroads',
		displayNameAbbreviation: 'Xroad',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'233': {
		expandedFullText: 'Cutoff',
		displayNameAbbreviation: 'Cutoff',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'235': {
		expandedFullText: 'Dam',
		displayNameAbbreviation: 'Dm',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'236': {
		expandedFullText: 'Delta Road',
		displayNameAbbreviation: 'Delta Rd',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'237': {
		expandedFullText: 'Department',
		displayNameAbbreviation: 'Dept',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'238': {
		expandedFullText: 'Depot',
		displayNameAbbreviation: 'Dep',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'239': {
		expandedFullText: 'Detention Center',
		displayNameAbbreviation: 'Detention Ctr',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'240': {
		expandedFullText: 'District of Columbia Highway',
		displayNameAbbreviation: 'DC Hwy',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'241': {
		expandedFullText: 'Ditch',
		displayNameAbbreviation: 'Ditch',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'242': {
		expandedFullText: 'Divide',
		displayNameAbbreviation: 'Dv',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'243': {
		expandedFullText: 'Dock',
		displayNameAbbreviation: 'Dock',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'244': {
		expandedFullText: 'Dormitory',
		displayNameAbbreviation: 'Dormitory',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'245': {
		expandedFullText: 'Drain',
		displayNameAbbreviation: 'Drn',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'246': {
		expandedFullText: 'Draw',
		displayNameAbbreviation: 'Draw',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'247': {
		expandedFullText: 'Drive',
		displayNameAbbreviation: 'Dr',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'248': {
		expandedFullText: 'Driveway',
		displayNameAbbreviation: 'Driveway',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'249': {
		expandedFullText: 'Dump',
		displayNameAbbreviation: 'Dump',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'251': {
		expandedFullText: 'Edificio',
		displayNameAbbreviation: 'Edif',
		spanishTranslation: 'Building',
		prefix: true,
		suffix: false
	},
	'252': {
		expandedFullText: 'Elementary School',
		displayNameAbbreviation: 'Elem School',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'253': {
		expandedFullText: 'Ensenada',
		displayNameAbbreviation: 'Ensenada',
		spanishTranslation: 'Cove',
		prefix: true,
		suffix: false
	},
	'254': {
		expandedFullText: 'Entrada',
		displayNameAbbreviation: 'Ent',
		spanishTranslation: 'Entrance',
		prefix: true,
		suffix: false
	},
	'256': {
		expandedFullText: 'Escuela',
		displayNameAbbreviation: 'Escuela',
		spanishTranslation: 'School',
		prefix: true,
		suffix: false
	},
	'680': {
		expandedFullText: 'Esplanade',
		displayNameAbbreviation: 'Esplanade',
		spanishTranslation: 'Esplanade',
		prefix: true,
		suffix: true
	},
	'257': {
		expandedFullText: 'Estates',
		displayNameAbbreviation: 'Ests',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'260': {
		expandedFullText: 'Estuary',
		displayNameAbbreviation: 'Estuary',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'261': {
		expandedFullText: 'Expreso',
		displayNameAbbreviation: 'Expreso',
		spanishTranslation: 'Expressway',
		prefix: true,
		suffix: false
	},
	'262': {
		expandedFullText: 'Expressway',
		displayNameAbbreviation: 'Expy',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'263': {
		expandedFullText: 'Extension',
		displayNameAbbreviation: 'Ext',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'264': {
		expandedFullText: 'Facility',
		displayNameAbbreviation: 'Faclty',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'265': {
		expandedFullText: 'Fairgrounds',
		displayNameAbbreviation: 'Fairgrounds',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'266': {
		expandedFullText: 'Falls',
		displayNameAbbreviation: 'Fls',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'267': {
		expandedFullText: 'Farm',
		displayNameAbbreviation: 'Frm',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'268': {
		expandedFullText: 'Farm Road',
		displayNameAbbreviation: 'Farm Rd',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'269': {
		expandedFullText: 'Farm-to-Market Road',
		displayNameAbbreviation: 'FM',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'275': {
		expandedFullText: 'Fence Line',
		displayNameAbbreviation: 'Fence Line',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'276': {
		expandedFullText: 'Ferry Crossing',
		displayNameAbbreviation: 'Ferry Crossing',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'277': {
		expandedFullText: 'Field',
		displayNameAbbreviation: 'Fld',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'278': {
		expandedFullText: 'Fire Control Road',
		displayNameAbbreviation: 'Fire Cntrl Rd',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'279': {
		expandedFullText: 'Fire Department',
		displayNameAbbreviation: 'Fire Dept',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'280': {
		expandedFullText: 'Fire District Road',
		displayNameAbbreviation: 'Fire Dist Rd',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'281': {
		expandedFullText: 'Fire Lane',
		displayNameAbbreviation: 'Fire Ln',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'282': {
		expandedFullText: 'Fire Road',
		displayNameAbbreviation: 'Fire Rd',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'283': {
		expandedFullText: 'Fire Route',
		displayNameAbbreviation: 'Fire Rte',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'284': {
		expandedFullText: 'Fire Station',
		displayNameAbbreviation: 'Fire Sta',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'285': {
		expandedFullText: 'Fire Trail',
		displayNameAbbreviation: 'Fire Trl',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'286': {
		expandedFullText: 'Flowage',
		displayNameAbbreviation: 'Flowage',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'287': {
		expandedFullText: 'Flume',
		displayNameAbbreviation: 'Flume',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'288': {
		expandedFullText: 'Forest',
		displayNameAbbreviation: 'Frst',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'289': {
		expandedFullText: 'Forest Highway',
		displayNameAbbreviation: 'Forest Hwy',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'290': {
		expandedFullText: 'Forest Road',
		displayNameAbbreviation: 'Forest Rd',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'291': {
		expandedFullText: 'Forest Route',
		displayNameAbbreviation: 'Forest Rte',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'292': {
		expandedFullText: 'Forest Service Road',
		displayNameAbbreviation: 'FS Rd',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'293': {
		expandedFullText: 'Fork',
		displayNameAbbreviation: 'Frk',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'294': {
		expandedFullText: 'Fort',
		displayNameAbbreviation: 'Ft',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'295': {
		expandedFullText: 'Four-Wheel Drive Trail',
		displayNameAbbreviation: '4WD Trl',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'296': {
		expandedFullText: 'Fraternity',
		displayNameAbbreviation: 'Frtrnty',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'297': {
		expandedFullText: 'Freeway',
		displayNameAbbreviation: 'Fwy',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'298': {
		expandedFullText: 'Garage',
		displayNameAbbreviation: 'Grge',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'299': {
		expandedFullText: 'Gardens',
		displayNameAbbreviation: 'Gdns',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'303': {
		expandedFullText: 'Glacier',
		displayNameAbbreviation: 'Glacier',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'304': {
		expandedFullText: 'Glen',
		displayNameAbbreviation: 'Gln',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'305': {
		expandedFullText: 'Golf Club',
		displayNameAbbreviation: 'Golf Club',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'306': {
		expandedFullText: 'Golf Course',
		displayNameAbbreviation: 'Golf Course',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'307': {
		expandedFullText: 'Grade',
		displayNameAbbreviation: 'Grade',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'309': {
		expandedFullText: 'Green',
		displayNameAbbreviation: 'Grn',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'310': {
		expandedFullText: 'Group Home',
		displayNameAbbreviation: 'Group Home',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'311': {
		expandedFullText: 'Gulch',
		displayNameAbbreviation: 'Gulch',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'312': {
		expandedFullText: 'Gulf',
		displayNameAbbreviation: 'Gulf',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'313': {
		expandedFullText: 'Gully',
		displayNameAbbreviation: 'Gully',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'314': {
		expandedFullText: 'Halfway House',
		displayNameAbbreviation: 'Halfway House',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'315': {
		expandedFullText: 'Hall',
		displayNameAbbreviation: 'Hall',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'316': {
		expandedFullText: 'Harbor',
		displayNameAbbreviation: 'Hbr',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'317': {
		expandedFullText: 'Heights',
		displayNameAbbreviation: 'Hts',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'321': {
		expandedFullText: 'High School',
		displayNameAbbreviation: 'High School',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'322': {
		expandedFullText: 'Highway',
		displayNameAbbreviation: 'Hwy',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'323': {
		expandedFullText: 'Hill',
		displayNameAbbreviation: 'Hl',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'324': {
		expandedFullText: 'Hollow',
		displayNameAbbreviation: 'Holw',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'325': {
		expandedFullText: 'Home',
		displayNameAbbreviation: 'Home',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'326': {
		expandedFullText: 'Hospital',
		displayNameAbbreviation: 'Hosp',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'327': {
		expandedFullText: 'Hostel',
		displayNameAbbreviation: 'Hostel',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'328': {
		expandedFullText: 'Hotel',
		displayNameAbbreviation: 'Hotel',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'329': {
		expandedFullText: 'House',
		displayNameAbbreviation: 'Hse',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'330': {
		expandedFullText: 'Housing',
		displayNameAbbreviation: 'Hsng',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'332': {
		expandedFullText: 'Iglesia',
		displayNameAbbreviation: 'Iglesia',
		spanishTranslation: 'Church',
		prefix: true,
		suffix: false
	},
	'333': {
		expandedFullText: 'Indian Route',
		displayNameAbbreviation: 'Indian Rte',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'334': {
		expandedFullText: 'Indian Service Route',
		displayNameAbbreviation: 'Indian Svc Rte',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'336': {
		expandedFullText: 'Industrial Park',
		displayNameAbbreviation: 'Indl Park',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'337': {
		expandedFullText: 'Inlet',
		displayNameAbbreviation: 'Inlt',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'338': {
		expandedFullText: 'Inn',
		displayNameAbbreviation: 'Inn',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'339': {
		expandedFullText: 'Institute',
		displayNameAbbreviation: 'Inst',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'340': {
		expandedFullText: 'Institution',
		displayNameAbbreviation: 'Instn',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'341': {
		expandedFullText: 'Instituto',
		displayNameAbbreviation: 'Instituto',
		spanishTranslation: 'Institute',
		prefix: true,
		suffix: false
	},
	'342': {
		expandedFullText: 'Intermediate School',
		displayNameAbbreviation: 'Inter School',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'344': {
		expandedFullText: 'Interstate Highway',
		displayNameAbbreviation: 'I-',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'345': {
		expandedFullText: 'Isla',
		displayNameAbbreviation: 'Isla',
		spanishTranslation: 'Island',
		prefix: true,
		suffix: false
	},
	'346': {
		expandedFullText: 'Island',
		displayNameAbbreviation: 'Is',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'347': {
		expandedFullText: 'Islands',
		displayNameAbbreviation: 'Iss',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'348': {
		expandedFullText: 'Isle',
		displayNameAbbreviation: 'Isle',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'349': {
		expandedFullText: 'Jail',
		displayNameAbbreviation: 'Jail',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'351': {
		expandedFullText: 'Jeep Trail',
		displayNameAbbreviation: 'Jeep Trl',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'352': {
		expandedFullText: 'Junction',
		displayNameAbbreviation: 'Junction',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'353': {
		expandedFullText: 'Junior High School',
		displayNameAbbreviation: 'Jr HS',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'356': {
		expandedFullText: 'Kill',
		displayNameAbbreviation: 'Kill',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'357': {
		expandedFullText: 'Lago',
		displayNameAbbreviation: 'Lago',
		spanishTranslation: 'Lake',
		prefix: true,
		suffix: false
	},
	'358': {
		expandedFullText: 'Lagoon',
		displayNameAbbreviation: 'Lagoon',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'360': {
		expandedFullText: 'Laguna',
		displayNameAbbreviation: 'Laguna',
		spanishTranslation: 'Lagoon',
		prefix: true,
		suffix: false
	},
	'361': {
		expandedFullText: 'Lake',
		displayNameAbbreviation: 'Lk',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'362': {
		expandedFullText: 'Lakes',
		displayNameAbbreviation: 'Lks',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'363': {
		expandedFullText: 'Landfill',
		displayNameAbbreviation: 'Lndfll',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'364': {
		expandedFullText: 'Landing',
		displayNameAbbreviation: 'Lndg',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'365': {
		expandedFullText: 'Landing Area',
		displayNameAbbreviation: 'Landing Area',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'366': {
		expandedFullText: 'Landing Field',
		displayNameAbbreviation: 'Landing Fld',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'367': {
		expandedFullText: 'Landing Strip',
		displayNameAbbreviation: 'Landing Strp',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'368': {
		expandedFullText: 'Lane',
		displayNameAbbreviation: 'Ln',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'369': {
		expandedFullText: 'Lateral',
		displayNameAbbreviation: 'Lateral',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'370': {
		expandedFullText: 'Levee',
		displayNameAbbreviation: 'Levee',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'371': {
		expandedFullText: 'Library',
		displayNameAbbreviation: 'Lbry',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'372': {
		expandedFullText: 'Lift',
		displayNameAbbreviation: 'Lift',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'373': {
		expandedFullText: 'Lighthouse',
		displayNameAbbreviation: 'Lighthouse',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'374': {
		expandedFullText: 'Line',
		displayNameAbbreviation: 'Line',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'376': {
		expandedFullText: 'Lodge',
		displayNameAbbreviation: 'Ldg',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'377': {
		expandedFullText: 'Logging Road',
		displayNameAbbreviation: 'Logging Rd',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'378': {
		expandedFullText: 'Loop',
		displayNameAbbreviation: 'Loop',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'379': {
		expandedFullText: 'Mall',
		displayNameAbbreviation: 'Mall',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'380': {
		expandedFullText: 'Manor',
		displayNameAbbreviation: 'Mnr',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'381': {
		expandedFullText: 'Mar',
		displayNameAbbreviation: 'Mar',
		spanishTranslation: 'Sea',
		prefix: true,
		suffix: false
	},
	'382': {
		expandedFullText: 'Marginal',
		displayNameAbbreviation: 'Marginal',
		spanishTranslation: 'Service Road',
		prefix: true,
		suffix: false
	},
	'383': {
		expandedFullText: 'Marina',
		displayNameAbbreviation: 'Mrna',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'384': {
		expandedFullText: 'Marsh',
		displayNameAbbreviation: 'Marsh',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'385': {
		expandedFullText: 'Meadows',
		displayNameAbbreviation: 'Mdws',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'386': {
		expandedFullText: 'Medical Building',
		displayNameAbbreviation: 'Medical Bldg',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'387': {
		expandedFullText: 'Medical Center',
		displayNameAbbreviation: 'Medical Ctr',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'388': {
		expandedFullText: 'Memorial',
		displayNameAbbreviation: 'Meml',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'389': {
		expandedFullText: 'Memorial Gardens',
		displayNameAbbreviation: 'Memorial Gnds',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'390': {
		expandedFullText: 'Memorial Park',
		displayNameAbbreviation: 'Memorial Pk',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'391': {
		expandedFullText: 'Mesa',
		displayNameAbbreviation: 'Mesa',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'392': {
		expandedFullText: 'Middle School',
		displayNameAbbreviation: 'Mid Schl',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'393': {
		expandedFullText: 'Military Reservation',
		displayNameAbbreviation: 'Mil Res',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'394': {
		expandedFullText: 'Millpond',
		displayNameAbbreviation: 'Millpond',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'395': {
		expandedFullText: 'Mine',
		displayNameAbbreviation: 'Mine',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'396': {
		expandedFullText: 'Mission',
		displayNameAbbreviation: 'Mssn',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'397': {
		expandedFullText: 'Mobile Home Community',
		displayNameAbbreviation: 'Mobile Hm Cmty',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'398': {
		expandedFullText: 'Mobile Home Estates',
		displayNameAbbreviation: 'Mobile Hm Est',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'399': {
		expandedFullText: 'Mobile Home Park',
		displayNameAbbreviation: 'Mobile Hm Pk',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'400': {
		expandedFullText: 'Monastery',
		displayNameAbbreviation: 'Monstry',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'401': {
		expandedFullText: 'Monument',
		displayNameAbbreviation: 'Mnmt',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'403': {
		expandedFullText: 'Mosque',
		displayNameAbbreviation: 'Mosque',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'404': {
		expandedFullText: 'Motel',
		displayNameAbbreviation: 'Mtl',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'405': {
		expandedFullText: 'Motor Lodge',
		displayNameAbbreviation: 'Motor Lodge',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'406': {
		expandedFullText: 'Motorway',
		displayNameAbbreviation: 'Mtwy',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'407': {
		expandedFullText: 'Mount',
		displayNameAbbreviation: 'Mt',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'408': {
		expandedFullText: 'Mountain',
		displayNameAbbreviation: 'Mtn',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'411': {
		expandedFullText: 'Museum',
		displayNameAbbreviation: 'Mus',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'412': {
		expandedFullText: 'National Battlefield',
		displayNameAbbreviation: 'Natl Bfld',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'413': {
		expandedFullText: 'National Battlefield Park',
		displayNameAbbreviation: 'Natl Bfld Pk',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'414': {
		expandedFullText: 'National Battlefield Site',
		displayNameAbbreviation: 'Natl Bfld Site',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'415': {
		expandedFullText: 'National Conservation Area',
		displayNameAbbreviation: 'Natl Cnsv Area',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'416': {
		expandedFullText: 'National Forest',
		displayNameAbbreviation: 'Natl Forest',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'417': {
		expandedFullText: 'National Forest Development Road',
		displayNameAbbreviation: 'Nat For Dev Rd',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'419': {
		expandedFullText: 'National Grasslands',
		displayNameAbbreviation: 'Natl Grsslnds',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'420': {
		expandedFullText: 'National Historic Site',
		displayNameAbbreviation: 'Natl Hist Site',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'421': {
		expandedFullText: 'National Historical Park',
		displayNameAbbreviation: 'Natl Hist Pk',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'422': {
		expandedFullText: 'National Lakeshore',
		displayNameAbbreviation: 'Natl Lkshr',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'423': {
		expandedFullText: 'National Memorial',
		displayNameAbbreviation: 'Natl Meml',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'424': {
		expandedFullText: 'National Military Park',
		displayNameAbbreviation: 'Natl Mil Pk',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'425': {
		expandedFullText: 'National Monument',
		displayNameAbbreviation: 'Natl Mnmt',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'426': {
		expandedFullText: 'National Park',
		displayNameAbbreviation: 'Natl Pk',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'427': {
		expandedFullText: 'National Preserve',
		displayNameAbbreviation: 'Natl Prsv',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'428': {
		expandedFullText: 'National Recreation Area',
		displayNameAbbreviation: 'Natl Rec Area',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'429': {
		expandedFullText: 'National Recreational River',
		displayNameAbbreviation: 'Natl Rec Riv',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'430': {
		expandedFullText: 'National Reserve',
		displayNameAbbreviation: 'Natl Resv',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'431': {
		expandedFullText: 'National River',
		displayNameAbbreviation: 'Natl Riv',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'432': {
		expandedFullText: 'National Scenic Area',
		displayNameAbbreviation: 'Natl Sc Area',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'433': {
		expandedFullText: 'National Scenic River',
		displayNameAbbreviation: 'Natl Sc Riv',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'435': {
		expandedFullText: 'National Scenic Riverways',
		displayNameAbbreviation: 'Natl Sc Rvrwys',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'436': {
		expandedFullText: 'National Scenic Trail',
		displayNameAbbreviation: 'Natl Sc Trl',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'437': {
		expandedFullText: 'National Seashore',
		displayNameAbbreviation: 'Natl Shr',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'438': {
		expandedFullText: 'National Wildlife Refuge',
		displayNameAbbreviation: 'Natl Wld Rfg',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'439': {
		expandedFullText: 'Navajo Service Route',
		displayNameAbbreviation: 'Navajo Svc Rte',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'440': {
		expandedFullText: 'Naval Air Station',
		displayNameAbbreviation: 'Naval Air Sta',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'442': {
		expandedFullText: 'Nursing Home',
		displayNameAbbreviation: 'Nurse Home',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'444': {
		expandedFullText: 'Ocean',
		displayNameAbbreviation: 'Ocean',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'445': {
		expandedFullText: 'Oceano',
		displayNameAbbreviation: 'Océano',
		spanishTranslation: 'Ocean',
		prefix: true,
		suffix: false
	},
	'446': {
		expandedFullText: 'Office',
		displayNameAbbreviation: 'Ofc',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'447': {
		expandedFullText: 'Office Building',
		displayNameAbbreviation: 'Office Bldg',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'449': {
		expandedFullText: 'Office Park',
		displayNameAbbreviation: 'Office Park',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'698': {
		expandedFullText: 'Orchard',
		displayNameAbbreviation: 'Orchard',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'451': {
		expandedFullText: 'Orchards',
		displayNameAbbreviation: 'Orchrds',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'452': {
		expandedFullText: 'Orphanage',
		displayNameAbbreviation: 'Orphanage',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'453': {
		expandedFullText: 'Outlet',
		displayNameAbbreviation: 'Outlet',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'454': {
		expandedFullText: 'Oval',
		displayNameAbbreviation: 'Oval',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'455': {
		expandedFullText: 'Overpass',
		displayNameAbbreviation: 'Opas',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'456': {
		expandedFullText: 'Parish Road',
		displayNameAbbreviation: 'Parish Rd',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'457': {
		expandedFullText: 'Park',
		displayNameAbbreviation: 'Park',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'458': {
		expandedFullText: 'Park and Ride',
		displayNameAbbreviation: 'Park and Ride',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'460': {
		expandedFullText: 'Parkway',
		displayNameAbbreviation: 'Pkwy',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'706': {
		expandedFullText: 'Parq',
		displayNameAbbreviation: 'Parq',
		spanishTranslation: 'Park',
		prefix: true,
		suffix: false
	},
	'461': {
		expandedFullText: 'Parque',
		displayNameAbbreviation: 'Parque',
		spanishTranslation: 'Park',
		prefix: true,
		suffix: false
	},
	'462': {
		expandedFullText: 'Pasaje',
		displayNameAbbreviation: 'Pasaje',
		spanishTranslation: 'Passage',
		prefix: true,
		suffix: false
	},
	'463': {
		expandedFullText: 'Paseo',
		displayNameAbbreviation: 'Pso',
		spanishTranslation: 'Path',
		prefix: true,
		suffix: false
	},
	'464': {
		expandedFullText: 'Pass',
		displayNameAbbreviation: 'Pass',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'465': {
		expandedFullText: 'Passage',
		displayNameAbbreviation: 'Psge',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'466': {
		expandedFullText: 'Path',
		displayNameAbbreviation: 'Path',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'682': {
		expandedFullText: 'Pavilion',
		displayNameAbbreviation: 'Pavilion',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'467': {
		expandedFullText: 'Peak',
		displayNameAbbreviation: 'Peak',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'705': {
		expandedFullText: 'Penitentiary',
		displayNameAbbreviation: 'Penitentiary',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'468': {
		expandedFullText: 'Pier',
		displayNameAbbreviation: 'Pier',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'469': {
		expandedFullText: 'Pike',
		displayNameAbbreviation: 'Pike',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'470': {
		expandedFullText: 'Pipeline',
		displayNameAbbreviation: 'Pipeline',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'472': {
		expandedFullText: 'Place',
		displayNameAbbreviation: 'Pl',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'473': {
		expandedFullText: 'Placita',
		displayNameAbbreviation: 'Pla',
		spanishTranslation: 'Little Plaza',
		prefix: true,
		suffix: false
	},
	'474': {
		expandedFullText: 'Plant',
		displayNameAbbreviation: 'Plnt',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'683': {
		expandedFullText: 'Plantation',
		displayNameAbbreviation: 'Plantation',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'475': {
		expandedFullText: 'Playa',
		displayNameAbbreviation: 'Playa',
		spanishTranslation: 'Beach',
		prefix: true,
		suffix: false
	},
	'476': {
		expandedFullText: 'Playground',
		displayNameAbbreviation: 'Playground',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'477': {
		expandedFullText: 'Plaza',
		displayNameAbbreviation: 'Plz',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'478': {
		expandedFullText: 'Point',
		displayNameAbbreviation: 'Pt',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'479': {
		expandedFullText: 'Pointe',
		displayNameAbbreviation: 'Pointe',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'480': {
		expandedFullText: 'Police Department',
		displayNameAbbreviation: 'Police Dept',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'481': {
		expandedFullText: 'Police Station',
		displayNameAbbreviation: 'Police Station',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'482': {
		expandedFullText: 'Pond',
		displayNameAbbreviation: 'Pond',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'483': {
		expandedFullText: 'Ponds',
		displayNameAbbreviation: 'Ponds',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'485': {
		expandedFullText: 'Port',
		displayNameAbbreviation: 'Prt',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'486': {
		expandedFullText: 'Post Office',
		displayNameAbbreviation: 'Post Office',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'487': {
		expandedFullText: 'Power Line',
		displayNameAbbreviation: 'Power Line',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'691': {
		expandedFullText: 'Power Plant',
		displayNameAbbreviation: 'Power Plant',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'488': {
		expandedFullText: 'Prairie',
		displayNameAbbreviation: 'Pr',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'489': {
		expandedFullText: 'Preserve',
		displayNameAbbreviation: 'Preserve',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'491': {
		expandedFullText: 'Prison',
		displayNameAbbreviation: 'Prison',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'690': {
		expandedFullText: 'Prison Farm',
		displayNameAbbreviation: 'Prison Farm',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'685': {
		expandedFullText: 'Promenade',
		displayNameAbbreviation: 'Promenade',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'492': {
		expandedFullText: 'Prong',
		displayNameAbbreviation: 'Prong',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'494': {
		expandedFullText: 'Puente',
		displayNameAbbreviation: 'Puente',
		spanishTranslation: 'Bridge',
		prefix: true,
		suffix: false
	},
	'495': {
		expandedFullText: 'Quadrangle',
		displayNameAbbreviation: 'Quadrangle',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'496': {
		expandedFullText: 'Quarry',
		displayNameAbbreviation: 'Quar',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'686': {
		expandedFullText: 'Quarters',
		displayNameAbbreviation: 'Quarters',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'497': {
		expandedFullText: 'Quebrada',
		displayNameAbbreviation: 'Qbda',
		spanishTranslation: 'Creek',
		prefix: true,
		suffix: false
	},
	'499': {
		expandedFullText: 'Race',
		displayNameAbbreviation: 'Race',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'501': {
		expandedFullText: 'Rail',
		displayNameAbbreviation: 'Rail',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'502': {
		expandedFullText: 'Rail Link',
		displayNameAbbreviation: 'Rail Link',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'504': {
		expandedFullText: 'Railnet',
		displayNameAbbreviation: 'Railnet',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'505': {
		expandedFullText: 'Railroad',
		displayNameAbbreviation: 'RR',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'506': {
		expandedFullText: 'Railway',
		displayNameAbbreviation: 'Rlwy',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'507': {
		expandedFullText: 'Ramal',
		displayNameAbbreviation: 'Ramal',
		spanishTranslation: 'Short Street',
		prefix: true,
		suffix: false
	},
	'508': {
		expandedFullText: 'Ramp',
		displayNameAbbreviation: 'Ramp',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'510': {
		expandedFullText: 'Ranch Road',
		displayNameAbbreviation: 'Ranch Rd',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'511': {
		expandedFullText: 'Ranch to Market Road',
		displayNameAbbreviation: 'RM',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'512': {
		expandedFullText: 'Rancho',
		displayNameAbbreviation: 'Rch',
		spanishTranslation: 'Ranch or Farm',
		prefix: true,
		suffix: false
	},
	'513': {
		expandedFullText: 'Ravine',
		displayNameAbbreviation: 'Ravine',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'514': {
		expandedFullText: 'Recreation Area',
		displayNameAbbreviation: 'Rec Area',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'515': {
		expandedFullText: 'Reformatory',
		displayNameAbbreviation: 'Reformatory',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'516': {
		expandedFullText: 'Refuge',
		displayNameAbbreviation: 'Refuge',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'518': {
		expandedFullText: 'Regional Park',
		displayNameAbbreviation: 'Regional Pk',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'519': {
		expandedFullText: 'Reservation',
		displayNameAbbreviation: 'Reservation',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'520': {
		expandedFullText: 'Reservation Highway',
		displayNameAbbreviation: 'Resvn Hwy',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'521': {
		expandedFullText: 'Reserve',
		displayNameAbbreviation: 'Resv',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'522': {
		expandedFullText: 'Reservoir',
		displayNameAbbreviation: 'Reservoir',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'524': {
		expandedFullText: 'Residence Hall',
		displayNameAbbreviation: 'Res Hall',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'525': {
		expandedFullText: 'Residencial',
		displayNameAbbreviation: 'Residencial',
		spanishTranslation: 'Public Housing Project',
		prefix: true,
		suffix: false
	},
	'526': {
		expandedFullText: 'Resort',
		displayNameAbbreviation: 'Resrt',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'688': {
		expandedFullText: 'Rest Home',
		displayNameAbbreviation: 'Rest Home',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'527': {
		expandedFullText: 'Retirement Home',
		displayNameAbbreviation: 'Retirement Hme',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'528': {
		expandedFullText: 'Retirement Village',
		displayNameAbbreviation: 'Retirement Vlg',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'529': {
		expandedFullText: 'Ridge',
		displayNameAbbreviation: 'Rdg',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'543': {
		expandedFullText: 'Rio',
		displayNameAbbreviation: 'Río',
		spanishTranslation: 'River',
		prefix: true,
		suffix: false
	},
	'530': {
		expandedFullText: 'River',
		displayNameAbbreviation: 'Riv',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'531': {
		expandedFullText: 'Road',
		displayNameAbbreviation: 'Rd',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'533': {
		expandedFullText: 'Roadway',
		displayNameAbbreviation: 'Roadway',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'535': {
		expandedFullText: 'Rock',
		displayNameAbbreviation: 'Rock',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'536': {
		expandedFullText: 'Rooming House',
		displayNameAbbreviation: 'Rooming Hse',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'537': {
		expandedFullText: 'Route',
		displayNameAbbreviation: 'Rte',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'538': {
		expandedFullText: 'Row',
		displayNameAbbreviation: 'Row',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'539': {
		expandedFullText: 'Rue',
		displayNameAbbreviation: 'Rue',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'540': {
		expandedFullText: 'Run',
		displayNameAbbreviation: 'Run',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'541': {
		expandedFullText: 'Runway',
		displayNameAbbreviation: 'Runway',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'542': {
		expandedFullText: 'Ruta',
		displayNameAbbreviation: 'Ruta',
		spanishTranslation: 'Route',
		prefix: true,
		suffix: false
	},
	'498': {
		expandedFullText: 'RV Park',
		displayNameAbbreviation: 'RV Park',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'545': {
		expandedFullText: 'Sanitarium',
		displayNameAbbreviation: 'Sanitarium',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'546': {
		expandedFullText: 'School',
		displayNameAbbreviation: 'Schl',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'549': {
		expandedFullText: 'Sea',
		displayNameAbbreviation: 'Sea',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'550': {
		expandedFullText: 'Seashore',
		displayNameAbbreviation: 'Seashore',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'552': {
		expandedFullText: 'Sector',
		displayNameAbbreviation: 'Sec',
		spanishTranslation: 'Sector',
		prefix: true,
		suffix: false
	},
	'553': {
		expandedFullText: 'Seminary',
		displayNameAbbreviation: 'Smry',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'554': {
		expandedFullText: 'Sendero',
		displayNameAbbreviation: 'Sendero',
		spanishTranslation: 'Foot Path',
		prefix: true,
		suffix: false
	},
	'555': {
		expandedFullText: 'Service Road',
		displayNameAbbreviation: 'Svc Rd',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'556': {
		expandedFullText: 'Shelter',
		displayNameAbbreviation: 'Shelter',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'558': {
		expandedFullText: 'Shop',
		displayNameAbbreviation: 'Shop',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'699': {
		expandedFullText: 'Shopping Center',
		displayNameAbbreviation: 'Shopping Ctr',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'560': {
		expandedFullText: 'Shopping Mall',
		displayNameAbbreviation: 'Shopping Mall',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'700': {
		expandedFullText: 'Shopping Plaza',
		displayNameAbbreviation: 'Shopping Plz',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'703': {
		expandedFullText: 'Site',
		displayNameAbbreviation: 'Site',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'564': {
		expandedFullText: 'Skyway',
		displayNameAbbreviation: 'Skwy',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'565': {
		expandedFullText: 'Slough',
		displayNameAbbreviation: 'Slough',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'566': {
		expandedFullText: 'Sonda',
		displayNameAbbreviation: 'Sonda',
		spanishTranslation: 'Sound',
		prefix: true,
		suffix: false
	},
	'567': {
		expandedFullText: 'Sorority',
		displayNameAbbreviation: 'Sorority',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'568': {
		expandedFullText: 'Sound',
		displayNameAbbreviation: 'Snd',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'569': {
		expandedFullText: 'Spa',
		displayNameAbbreviation: 'Spa',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'570': {
		expandedFullText: 'Speedway',
		displayNameAbbreviation: 'Speedway',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'571': {
		expandedFullText: 'Spring',
		displayNameAbbreviation: 'Spg',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'572': {
		expandedFullText: 'Spur',
		displayNameAbbreviation: 'Spur',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'573': {
		expandedFullText: 'Square',
		displayNameAbbreviation: 'Sq',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'575': {
		expandedFullText: 'State Beach',
		displayNameAbbreviation: 'State Beach',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'577': {
		expandedFullText: 'State Forest',
		displayNameAbbreviation: 'State Forest',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'578': {
		expandedFullText: 'State Forest Service Road',
		displayNameAbbreviation: 'St FS Rd',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'579': {
		expandedFullText: 'State Highway',
		displayNameAbbreviation: 'State Hwy',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'580': {
		expandedFullText: 'State Hospital',
		displayNameAbbreviation: 'State Hospital',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'581': {
		expandedFullText: 'State Loop',
		displayNameAbbreviation: 'State Loop',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'582': {
		expandedFullText: 'State Park',
		displayNameAbbreviation: 'State Park',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'584': {
		expandedFullText: 'State Prison',
		displayNameAbbreviation: 'State Prison',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'585': {
		expandedFullText: 'State Road',
		displayNameAbbreviation: 'State Rd',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'586': {
		expandedFullText: 'State Route',
		displayNameAbbreviation: 'State Rte',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'588': {
		expandedFullText: 'State Spur',
		displayNameAbbreviation: 'State Spur',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'589': {
		expandedFullText: 'State Trunk Highway',
		displayNameAbbreviation: 'St Trunk Hwy',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'591': {
		expandedFullText: 'Station',
		displayNameAbbreviation: 'Sta',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'592': {
		expandedFullText: 'Strait',
		displayNameAbbreviation: 'Strait',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'593': {
		expandedFullText: 'Stravenue',
		displayNameAbbreviation: 'Stra',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'594': {
		expandedFullText: 'Stream',
		displayNameAbbreviation: 'Strm',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'595': {
		expandedFullText: 'Street',
		displayNameAbbreviation: 'St',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'596': {
		expandedFullText: 'Strip',
		displayNameAbbreviation: 'Strip',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'599': {
		expandedFullText: 'Swamp',
		displayNameAbbreviation: 'Swamp',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'600': {
		expandedFullText: 'Synagogue',
		displayNameAbbreviation: 'Synagogue',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'601': {
		expandedFullText: 'Tank',
		displayNameAbbreviation: 'Tank',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'603': {
		expandedFullText: 'Temple',
		displayNameAbbreviation: 'Tmpl',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'604': {
		expandedFullText: 'Terminal',
		displayNameAbbreviation: 'Trmnl',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'605': {
		expandedFullText: 'Terrace',
		displayNameAbbreviation: 'Ter',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'687': {
		expandedFullText: 'Thoroughfare',
		displayNameAbbreviation: 'Thoroughfare',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'607': {
		expandedFullText: 'Toll Booth',
		displayNameAbbreviation: 'Toll Booth',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'701': {
		expandedFullText: 'Toll Road',
		displayNameAbbreviation: 'Toll Rd',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'610': {
		expandedFullText: 'Tollway',
		displayNameAbbreviation: 'Tollway',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'611': {
		expandedFullText: 'Tower',
		displayNameAbbreviation: 'Twr',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'612': {
		expandedFullText: 'Town Center',
		displayNameAbbreviation: 'Town Ctr',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'613': {
		expandedFullText: 'Town Hall',
		displayNameAbbreviation: 'Town Hall',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'614': {
		expandedFullText: 'Town Highway',
		displayNameAbbreviation: 'Town Hwy',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'615': {
		expandedFullText: 'Town Road',
		displayNameAbbreviation: 'Town Rd',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'616': {
		expandedFullText: 'Towne Center',
		displayNameAbbreviation: 'Towne Ctr',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'617': {
		expandedFullText: 'Township Highway',
		displayNameAbbreviation: 'Twp Hwy',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'618': {
		expandedFullText: 'Township Road',
		displayNameAbbreviation: 'Twp Rd',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'619': {
		expandedFullText: 'Trace',
		displayNameAbbreviation: 'Trce',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'620': {
		expandedFullText: 'Track',
		displayNameAbbreviation: 'Trak',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'621': {
		expandedFullText: 'Trafficway',
		displayNameAbbreviation: 'Trfy',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'622': {
		expandedFullText: 'Trail',
		displayNameAbbreviation: 'Trl',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'623': {
		expandedFullText: 'Trailer Court',
		displayNameAbbreviation: 'Trailer Ct',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'624': {
		expandedFullText: 'Trailer Park',
		displayNameAbbreviation: 'Trailer Pk',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'628': {
		expandedFullText: 'Transmission Line',
		displayNameAbbreviation: 'Trans Ln',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'702': {
		expandedFullText: 'Treatment Plant',
		displayNameAbbreviation: 'Trmt Plant',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'630': {
		expandedFullText: 'Tribal Road',
		displayNameAbbreviation: 'Tribal Rd',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'632': {
		expandedFullText: 'Trolley',
		displayNameAbbreviation: 'Trolley',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'633': {
		expandedFullText: 'Truck Trail',
		displayNameAbbreviation: 'Truck Trl',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'636': {
		expandedFullText: 'Túnel',
		displayNameAbbreviation: 'Túnel',
		spanishTranslation: 'Tunnel',
		prefix: true,
		suffix: false
	},
	'634': {
		expandedFullText: 'Tunnel',
		displayNameAbbreviation: 'Tunl',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'635': {
		expandedFullText: 'Turnpike',
		displayNameAbbreviation: 'Tpke',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'637': {
		expandedFullText: 'Underpass',
		displayNameAbbreviation: 'Upas',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'642': {
		expandedFullText: 'Universidad',
		displayNameAbbreviation: 'Universidad',
		spanishTranslation: 'University or College',
		prefix: true,
		suffix: false
	},
	'643': {
		expandedFullText: 'University',
		displayNameAbbreviation: 'Univ',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'638': {
		expandedFullText: 'US Forest Service Highway',
		displayNameAbbreviation: 'USFS Hwy',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'639': {
		expandedFullText: 'US Forest Service Road',
		displayNameAbbreviation: 'USFS Rd',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'640': {
		expandedFullText: 'US Highway',
		displayNameAbbreviation: 'US Hwy',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'641': {
		expandedFullText: 'US Route',
		displayNameAbbreviation: 'US Rte',
		spanishTranslation: undefined,
		prefix: true,
		suffix: false
	},
	'644': {
		expandedFullText: 'Valley',
		displayNameAbbreviation: 'Vly',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'645': {
		expandedFullText: 'Vereda',
		displayNameAbbreviation: 'Ver',
		spanishTranslation: 'Path',
		prefix: true,
		suffix: false
	},
	'655': {
		expandedFullText: 'Via',
		displayNameAbbreviation: 'Via',
		spanishTranslation: 'Way',
		prefix: true,
		suffix: false
	},
	'646': {
		expandedFullText: 'Viaduct',
		displayNameAbbreviation: 'Viaduct',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'647': {
		expandedFullText: 'View',
		displayNameAbbreviation: 'Vw',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'648': {
		expandedFullText: 'Villa',
		displayNameAbbreviation: 'Villa',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'649': {
		expandedFullText: 'Village',
		displayNameAbbreviation: 'Vlg',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'650': {
		expandedFullText: 'Village Center',
		displayNameAbbreviation: 'Village Ctr',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'697': {
		expandedFullText: 'Vineyard',
		displayNameAbbreviation: 'Vineyard',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'652': {
		expandedFullText: 'Vineyards',
		displayNameAbbreviation: 'Vineyards',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'654': {
		expandedFullText: 'Vista',
		displayNameAbbreviation: 'Vis',
		spanishTranslation: 'View',
		prefix: true,
		suffix: true
	},
	'656': {
		expandedFullText: 'Walk',
		displayNameAbbreviation: 'Walk',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'657': {
		expandedFullText: 'Walkway',
		displayNameAbbreviation: 'Walkway',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'659': {
		expandedFullText: 'Wash',
		displayNameAbbreviation: 'Wash',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'660': {
		expandedFullText: 'Waterway',
		displayNameAbbreviation: 'Waterway',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'661': {
		expandedFullText: 'Way',
		displayNameAbbreviation: 'Way',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'663': {
		expandedFullText: 'Wharf',
		displayNameAbbreviation: 'Wharf',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'665': {
		expandedFullText: 'Wild and Scenic River',
		displayNameAbbreviation: 'Wld n Snc Riv',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'664': {
		expandedFullText: 'Wild River',
		displayNameAbbreviation: 'Wild River',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'666': {
		expandedFullText: 'Wilderness',
		displayNameAbbreviation: 'Wilderness',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'667': {
		expandedFullText: 'Wilderness Park',
		displayNameAbbreviation: 'Wilderenss Pk',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'668': {
		expandedFullText: 'Wildlife Management Area',
		displayNameAbbreviation: 'Wldlf Mgt Area',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'669': {
		expandedFullText: 'Winery',
		displayNameAbbreviation: 'Winery',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'672': {
		expandedFullText: 'Yard',
		displayNameAbbreviation: 'Yard',
		spanishTranslation: undefined,
		prefix: false,
		suffix: true
	},
	'673': {
		expandedFullText: 'Yards',
		displayNameAbbreviation: 'Yards',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'670': {
		expandedFullText: 'YMCA',
		displayNameAbbreviation: 'YMCA',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'671': {
		expandedFullText: 'YWCA',
		displayNameAbbreviation: 'YWCA',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	},
	'675': {
		expandedFullText: 'Zanja',
		displayNameAbbreviation: 'Zanja',
		spanishTranslation: 'Ditch',
		prefix: true,
		suffix: false
	},
	'676': {
		expandedFullText: 'Zoo',
		displayNameAbbreviation: 'Zoo',
		spanishTranslation: undefined,
		prefix: true,
		suffix: true
	}
} as const satisfies Record<string, Type>;

type PrefixTypes = PositionalPick<typeof types, 'prefix'>;
type SuffixTypes = PositionalPick<typeof types, 'suffix'>;

function match(
	test: string,
	name: string,
	component: Array<string>,
	...rest: Array<Array<string>>
) {
	if (rest.length === 0) {
		for (const option of component) {
			const attempt = (name + ' ' + option).trim();
			if (attempt === test) {
				return true;
			}
		}

		return false;
	}

	for (const option of component) {
		const attempt = match(test, (name + ' ' + option).trim(), rest[0], ...rest.slice(1));
		if (attempt) {
			return true;
		}
	}

	return false;
}

const formatNumberOrdinal = (d: number) => {
	const ordinal = new Intl.PluralRules('en-US', { type: 'ordinal' });
	const suffixes = {
		zero: 'th',
		one: 'st',
		two: 'nd',
		few: 'rd',
		other: 'th',
		many: 'th'
	};

	return `${d}${suffixes[ordinal.select(d)]}`;
};

export const matchFeature = (f: RoadFeature, attempt: string) => {
	if (f.properties.FULLNAME.toLowerCase() === attempt) {
		return true;
	}

	const prefixQualifier =
		f.properties.PREQUAL === undefined ? undefined : qualifiers[f.properties.PREQUAL];
	const prefixDirection =
		f.properties.PREDIR === undefined ? undefined : directions[f.properties.PREDIR];
	const prefixType = f.properties.PRETYP === undefined ? undefined : types[f.properties.PRETYP];

	const base = f.properties.NAME;

	let numericalBase: string | undefined = undefined;
	const numericalMatch = base.match(/^\d+/);
	if (numericalMatch !== null && numericalMatch.length > 0) {
		const parsedNumericalMatch = +numericalMatch[0];
		if (!isNaN(parsedNumericalMatch)) {
			if (formatNumberOrdinal(parsedNumericalMatch) === base) {
				numericalBase = String(parsedNumericalMatch);
			}
		}
	}

	const suffixType = f.properties.SUFTYP === undefined ? undefined : types[f.properties.SUFTYP];
	const suffixDirection =
		f.properties.SUFDIR === undefined ? undefined : directions[f.properties.SUFDIR];
	const suffixQualifier =
		f.properties.SUFQUAL === undefined ? undefined : qualifiers[f.properties.SUFQUAL];

	const components = [
		[prefixQualifier?.displayNameAbbreviation, prefixQualifier?.expandedFullText],
		[
			prefixDirection?.directionalAbbreviation,
			prefixDirection?.expandedFullText,
			prefixDirection?.spanishTranslation
		],
		[
			prefixType?.displayNameAbbreviation,
			prefixType?.expandedFullText,
			prefixType?.spanishTranslation
		],
		[base, numericalBase],
		[
			suffixType?.displayNameAbbreviation,
			suffixType?.expandedFullText,
			suffixType?.spanishTranslation
		],
		[
			suffixDirection?.directionalAbbreviation,
			suffixDirection?.expandedFullText,
			suffixDirection?.spanishTranslation
		],
		[suffixQualifier?.displayNameAbbreviation, suffixQualifier?.expandedFullText]
	]
		.map((component) => {
			return component
				.filter((option) => option !== undefined)
				.map((option) => option.toLowerCase());
		})
		.filter((component) => component.length > 0);

	return match(attempt, '', components[0], ...components.slice(1));
};

export const formatFeatureName = (f: RoadFeature) => {
	const {
		properties: { PREQUAL, PREDIR, PRETYP, NAME, SUFTYP, SUFDIR, SUFQUAL }
	} = f;

	let name = '';
	if (PREQUAL) {
		name += qualifiers[PREQUAL].expandedFullText + ' ';
	}

	if (PREDIR) {
		name += directions[PREDIR].expandedFullText + ' ';
	}

	if (PRETYP) {
		name += types[PRETYP].expandedFullText + ' ';
	}

	name += NAME + ' ';

	if (SUFTYP) {
		name += types[SUFTYP].expandedFullText + ' ';
	}

	if (SUFDIR) {
		name += directions[SUFDIR].expandedFullText + ' ';
	}

	if (SUFQUAL) {
		name += qualifiers[SUFQUAL].expandedFullText;
	}

	return name;
};
