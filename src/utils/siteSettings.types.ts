/** The editable site-wide content, after defaults have been applied. */
export interface SiteSettings {
	name: string;
	statement: string;
	roleLine?: string;
	availabilityLine?: string;
	about?: string;
	email?: string;
	contactHeading: string;
	siteTitle: string;
	siteDescription: string;
}

/** What Sanity returns: any field the editor has not filled in comes back as null. */
export type RawSiteSettings = {
	[K in keyof SiteSettings]?: SiteSettings[K] | null;
};
