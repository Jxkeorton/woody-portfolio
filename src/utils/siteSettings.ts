import type { RawSiteSettings, SiteSettings } from './siteSettings.types';

/** Used until the editor publishes site settings, so the site always builds. */
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
	name: 'Woody Orton',
	statement:
		"I'm an automotive engineering student who likes to test an idea, measure what happened and fix what didn't work.",
	details: [],
	skills: [],
	about:
		'I am a second-year BEng Automotive Engineering student at Loughborough University, with a strong foundation in engineering principles and a particular interest in vehicle design, performance and development. Through university projects, Formula Student and practical automotive experience, I have developed skills in CAD modelling, technical drawing, MATLAB and component manufacture. I am keen to apply my analytical and practical engineering skills to real-world challenges while continuing to develop as an engineer during an industrial placement.',
	email: 'woodyorton@outlook.com',
	linkedinUrl: 'https://www.linkedin.com/in/w-orton/',
	contactHeading: 'Hiring for a placement or graduate role?',
	siteTitle: 'Woody Orton · Automotive engineering student',
	siteDescription:
		'Portfolio of Woody Orton, an automotive engineering student looking for a placement or graduate role.',
};

/** Treats null and empty strings from Sanity as "not filled in". */
const filled = (value: string | null | undefined) => (value?.trim() ? value : undefined);

export const resolveSiteSettings = (raw: RawSiteSettings | null): SiteSettings => {
	if (!raw) return DEFAULT_SITE_SETTINGS;
	const d = DEFAULT_SITE_SETTINGS;
	return {
		name: filled(raw.name) ?? d.name,
		statement: filled(raw.statement) ?? d.statement,
		details: (raw.details ?? []).filter((detail) => filled(detail.label) && filled(detail.value)),
		skills: (raw.skills ?? []).filter((skill) => filled(skill)),
		roleLine: filled(raw.roleLine),
		availabilityLine: filled(raw.availabilityLine),
		about: filled(raw.about) ?? d.about,
		profileImage: raw.profileImage?.asset ? raw.profileImage : undefined,
		email: filled(raw.email) ?? d.email,
		linkedinUrl: filled(raw.linkedinUrl) ?? d.linkedinUrl,
		contactHeading: filled(raw.contactHeading) ?? d.contactHeading,
		siteTitle: filled(raw.siteTitle) ?? d.siteTitle,
		siteDescription: filled(raw.siteDescription) ?? d.siteDescription,
	};
};
