import type { RawSiteSettings, SiteSettings } from './siteSettings.types';

export const full: SiteSettings = {
	name: 'Woody',
	statement: 'I test an idea, measure what happened and fix what did not work.',
	roleLine: 'Automotive engineering student',
	availabilityLine: 'Open to placements and graduate roles',
	about: 'I am in my third year. Each project shows the method and the numbers.',
	email: 'woody@example.org',
	contactHeading: 'Hiring for a placement or graduate role?',
	siteTitle: 'Woody · Automotive engineering student',
	siteDescription: 'Portfolio of Woody, an automotive engineering student.',
};

/** Only the fields an editor must fill in. */
export const minimal: SiteSettings = {
	name: 'Woody',
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
	email: null,
	contactHeading: null,
	siteTitle: null,
	siteDescription: null,
};

export const longStatement = 'I measure what happened and fix what did not work. '.repeat(4).trim();
