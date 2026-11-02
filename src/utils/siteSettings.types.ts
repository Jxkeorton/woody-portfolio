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

/** The editable site-wide content, after defaults have been applied. */
export interface SiteSettings {
	name: string;
	statement: string;
	roleLine?: string;
	availabilityLine?: string;
	about?: string;
	profileImage?: ProfileImage;
	email?: string;
	contactHeading: string;
	siteTitle: string;
	siteDescription: string;
}

/** What Sanity returns: any field the editor has not filled in comes back as null. */
export type RawSiteSettings = {
	[K in keyof SiteSettings]?: SiteSettings[K] | null;
};
