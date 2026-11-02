import type { RawSiteSettings, SiteSettings } from './siteSettings.types';

/** Used until the editor publishes site settings, so the site always builds. */
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
	name: 'Woody',
	statement:
		"I'm an automotive engineering student who likes to test an idea, measure what happened and fix what didn't work.",
	contactHeading: 'Hiring for a placement or graduate role?',
	siteTitle: 'Woody · Automotive engineering student',
	siteDescription:
		'Portfolio of Woody, an automotive engineering student looking for a placement or graduate role.',
};

/** Treats null and empty strings from Sanity as "not filled in". */
const filled = (value: string | null | undefined) => (value?.trim() ? value : undefined);

export const resolveSiteSettings = (raw: RawSiteSettings | null): SiteSettings => {
	if (!raw) return DEFAULT_SITE_SETTINGS;
	const d = DEFAULT_SITE_SETTINGS;
	return {
		name: filled(raw.name) ?? d.name,
		statement: filled(raw.statement) ?? d.statement,
		roleLine: filled(raw.roleLine),
		availabilityLine: filled(raw.availabilityLine),
		about: filled(raw.about),
		email: filled(raw.email),
		contactHeading: filled(raw.contactHeading) ?? d.contactHeading,
		siteTitle: filled(raw.siteTitle) ?? d.siteTitle,
		siteDescription: filled(raw.siteDescription) ?? d.siteDescription,
	};
};
