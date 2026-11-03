import type { ProfileImage, RawSiteSettings, SiteSettings } from './siteSettings.types';

export const profileImage: ProfileImage = {
	alt: 'Woody beside the finished car',
	hotspot: { x: 0.3, y: 0.25, width: 0.4, height: 0.4 },
	asset: {
		_id: 'image-profile000000000000000000000000-900x1200-jpg',
		metadata: { lqip: 'data:image/jpeg;base64,/9j/lqip', dimensions: { width: 900, height: 1200 } },
	},
};

export const croppedProfileImage: ProfileImage = {
	...profileImage,
	crop: { top: 0.1, bottom: 0.1, left: 0, right: 0 },
};

export const full: SiteSettings = {
	name: 'Woody Orton',
	statement: 'I test an idea, measure what happened and fix what did not work.',
	details: [
		{ _key: 'degree', label: 'Degree', value: 'BEng Automotive' },
		{ _key: 'year', label: 'Year', value: '3' },
		{ _key: 'based', label: 'Based', value: 'Coventry' },
		{ _key: 'available', label: 'Available', value: 'Jul 2027' },
	],
	skills: ['CATIA', 'MATLAB/Simulink', 'Ansys', 'GT-SUITE', 'Python'],
	roleLine: 'Automotive engineering student',
	availabilityLine: 'Open to placements and graduate roles',
	about: 'I am in my third year. Each project shows the method and the numbers.',
	profileImage,
	email: 'woody@example.org',
	linkedinUrl: 'https://www.linkedin.com/in/woody-example/',
	contactHeading: 'Hiring for a placement or graduate role?',
	siteTitle: 'Woody · Automotive engineering student',
	siteDescription: 'Portfolio of Woody, an automotive engineering student.',
};

/** Only the fields an editor must fill in. */
export const minimal: SiteSettings = {
	name: 'Woody Orton',
	details: [],
	skills: [],
	statement: 'I test ideas.',
	contactHeading: 'Get in touch',
	siteTitle: 'Woody',
	siteDescription: 'Portfolio of Woody.',
};

/** Sanity gives null for every field that was never filled in or has been cleared. */
export const rawCleared: RawSiteSettings = {
	name: null,
	statement: null,
	roleLine: null,
	availabilityLine: null,
	about: null,
	profileImage: null,
	email: null,
	linkedinUrl: null,
	details: null,
	skills: null,
	contactHeading: null,
	siteTitle: null,
	siteDescription: null,
};

export const longStatement = 'I measure what happened and fix what did not work. '.repeat(4).trim();
