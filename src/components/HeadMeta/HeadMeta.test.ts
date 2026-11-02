import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import HeadMeta from './HeadMeta.astro';

let container: AstroContainer;
beforeAll(async () => {
	container = await AstroContainer.create();
});

const props = {
	title: 'Woody Orton · Automotive engineering student',
	description: 'Portfolio of Woody Orton.',
	siteName: 'Woody Orton',
	path: '/projects/turbo',
	siteUrl: 'https://woody.example/',
};

const render = (overrides: Partial<typeof props> = {}) =>
	container.renderToString(HeadMeta, { props: { ...props, ...overrides } });

const meta = (html: string, key: 'name' | 'property', value: string) =>
	html.match(new RegExp(`<meta[^>]*${key}="${value}"[^>]*content="([^"]*)"`))?.[1] ??
	html.match(new RegExp(`<meta[^>]*content="([^"]*)"[^>]*${key}="${value}"`))?.[1];

describe('Head metadata', () => {
	describe('given a page title and description', () => {
		it('sets the page title and the search description', async () => {
			const html = await render();
			expect(html).toContain(`<title>${props.title}</title>`);
			expect(meta(html, 'name', 'description')).toBe(props.description);
		});
	});

	describe('given a site address', () => {
		it('shares the page with its title, description, site name and full address', async () => {
			const html = await render();
			expect(meta(html, 'property', 'og:type')).toBe('website');
			expect(meta(html, 'property', 'og:title')).toBe(props.title);
			expect(meta(html, 'property', 'og:description')).toBe(props.description);
			expect(meta(html, 'property', 'og:site_name')).toBe('Woody Orton');
			expect(meta(html, 'property', 'og:url')).toBe('https://woody.example/projects/turbo');
		});

		it('shares a full-address image with its size and a description of it', async () => {
			const html = await render();
			expect(meta(html, 'property', 'og:image')).toBe('https://woody.example/og-image.png');
			expect(meta(html, 'property', 'og:image:width')).toBe('1200');
			expect(meta(html, 'property', 'og:image:height')).toBe('630');
			expect(meta(html, 'property', 'og:image:alt')).toContain('Woody Orton');
		});

		it('asks Twitter and other cards for a large image', async () => {
			const html = await render();
			expect(meta(html, 'name', 'twitter:card')).toBe('summary_large_image');
			expect(meta(html, 'name', 'twitter:title')).toBe(props.title);
			expect(meta(html, 'name', 'twitter:image')).toBe('https://woody.example/og-image.png');
		});

		it('points search engines at the page address', async () => {
			expect(await render()).toContain(
				'<link rel="canonical" href="https://woody.example/projects/turbo"',
			);
		});
	});

	describe('given no site address', () => {
		it('still shares the title, description and image path, without a page address', async () => {
			const html = await render({ siteUrl: undefined });
			expect(meta(html, 'property', 'og:title')).toBe(props.title);
			expect(meta(html, 'property', 'og:image')).toBe('/og-image.png');
			expect(html).not.toContain('og:url');
			expect(html).not.toContain('rel="canonical"');
		});
	});

	describe('the icons', () => {
		it('offers the logo as an SVG icon, an ICO fallback and a touch icon', async () => {
			const html = await render();
			expect(html).toMatch(
				/<link[^>]*rel="icon"[^>]*href="\/favicon\.svg"[^>]*type="image\/svg\+xml"/,
			);
			expect(html).toMatch(/<link[^>]*rel="icon"[^>]*href="\/favicon\.ico"/);
			expect(html).toMatch(/<link[^>]*rel="apple-touch-icon"[^>]*href="\/apple-touch-icon\.png"/);
		});
	});
});
