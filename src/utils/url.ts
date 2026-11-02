/** Turns a site path into a full address when the address of the site is known. */
export const absoluteUrl = (path: string, siteUrl?: string) =>
	siteUrl ? `${siteUrl.replace(/\/+$/, '')}${path}` : path;
