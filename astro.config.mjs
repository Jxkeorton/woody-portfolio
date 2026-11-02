// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sanity from '@sanity/astro';

// astro.config.mjs runs before Astro loads env files, so load .env here (Node built-in, no extra dependency).
// The fallbacks are placeholders until the client's Sanity project exists; set the real values in .env.
try {
	process.loadEnvFile();
} catch {
	// no .env yet
}
const {
	PUBLIC_SANITY_PROJECT_ID,
	PUBLIC_SANITY_DATASET,
	PUBLIC_SITE_URL,
	VERCEL_PROJECT_PRODUCTION_URL,
} = process.env;

// Share links need full addresses. Set PUBLIC_SITE_URL, or rely on the production domain Vercel provides at build time.
const site =
	PUBLIC_SITE_URL ||
	(VERCEL_PROJECT_PRODUCTION_URL ? `https://${VERCEL_PROJECT_PRODUCTION_URL}` : undefined);

export default defineConfig({
	site,
	output: 'static',
	integrations: [
		sanity({
			projectId: PUBLIC_SANITY_PROJECT_ID || 'placeholder',
			dataset: PUBLIC_SANITY_DATASET || 'production',
			useCdn: false,
		}),
	],
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Newsreader',
			cssVariable: '--font-newsreader',
			weights: [300, 400, 500],
			styles: ['normal', 'italic'],
			subsets: ['latin'],
		},
		{
			provider: fontProviders.google(),
			name: 'IBM Plex Mono',
			cssVariable: '--font-plex-mono',
			weights: [400, 500],
			styles: ['normal'],
			subsets: ['latin'],
		},
	],
});
