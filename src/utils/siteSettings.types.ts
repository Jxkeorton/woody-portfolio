/** The profile photo shown in the About section. */
export interface ProfileImage {
	/** Describes the photo for people who cannot see it. Required in the schema. */
	alt: string;
	hotspot?: { x: number; y: number; width: number; height: number };
	crop?: { top: number; bottom: number; left: number; right: number };
	asset: {
		_id: string;
		metadata: { lqip?: string; dimensions: { width: number; height: number } };
	};
}

/** One label and value in the hero's drawing title block, for example Degree and BEng Automotive. */
export interface SiteDetail {
	_key: string;
	label: string;
	value: string;
}

/** The editable site-wide content, after defaults have been applied. */
export interface SiteSettings {
	name: string;
	statement: string;
	details: SiteDetail[];
	skills: string[];
	roleLine?: string;
	availabilityLine?: string;
	about?: string;
	profileImage?: ProfileImage;
	email?: string;
	linkedinUrl?: string;
	contactHeading: string;
	siteTitle: string;
	siteDescription: string;
}

/** What Sanity returns: any field the editor has not filled in comes back as null. */
export type RawSiteSettings = {
	[K in keyof SiteSettings]?: SiteSettings[K] | null;
};
