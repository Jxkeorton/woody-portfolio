// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
	output: 'static',
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Newsreader',
			cssVariable: '--font-newsreader',
			weights: [300, 400],
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
