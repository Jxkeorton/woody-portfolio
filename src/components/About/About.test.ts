import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import About from './About.astro';
import type { ProfileImage } from '../../utils/siteSettings.types';
import { croppedProfileImage, full, profileImage } from '../../utils/siteSettings.fixture';

let container: AstroContainer;
beforeAll(async () => {
	container = await AstroContainer.create();
});

const render = (about?: string, image?: ProfileImage) =>
	container.renderToString(About, { props: { about, profileImage: image } });

const img = (html: string) => html.match(/<img\b([^>]*)>/)?.[1] ?? '';
const attr = (attrs: string, name: string) => attrs.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];

describe('About', () => {
	describe('given about text', () => {
		it('shows it under an About heading', async () => {
			const html = await render(full.about);
			expect(html).toMatch(/<h2[^>]*>\s*About\s*<\/h2>/);
			expect(html).toContain(full.about);
		});
	});

	describe('given no about text', () => {
		it('shows nothing', async () => {
			expect((await render(undefined)).trim()).toBe('');
		});
	});

	describe('given a profile image', () => {
		it('shows it with its alt text and explicit dimensions', async () => {
			const attrs = img(await render(full.about, profileImage));
			expect(attr(attrs, 'alt')).toBe(profileImage.alt);
			expect(attr(attrs, 'width')).toBe('900');
			expect(attr(attrs, 'height')).toBe('1200');
		});

		it('loads it lazily from the Sanity CDN, at several sizes', async () => {
			const attrs = img(await render(full.about, profileImage));
			expect(attr(attrs, 'loading')).toBe('lazy');
			expect(attr(attrs, 'src')).toContain('cdn.sanity.io');
			expect(attr(attrs, 'srcset')).toContain(' ');
			expect(attr(attrs, 'sizes')).toBeTruthy();
		});

		it('keeps the focal point in view and uses the preview as a placeholder', async () => {
			const style = attr(img(await render(full.about, profileImage)), 'style');
			expect(style).toContain('object-position: 30% 25%');
			expect(style).toContain('data:image/jpeg;base64,/9j/lqip');
		});

		it('reports the size after the crop is applied', async () => {
			const attrs = img(await render(full.about, croppedProfileImage));
			expect(attr(attrs, 'width')).toBe('900');
			expect(attr(attrs, 'height')).toBe('960');
		});

		it('still shows the section when there is no about text', async () => {
			const html = await render(undefined, profileImage);
			expect(html).toMatch(/<h2[^>]*>\s*About\s*<\/h2>/);
			expect(html).toContain('<img');
		});
	});

	describe('given about text but no profile image', () => {
		it('shows no image', async () => {
			expect(await render(full.about)).not.toContain('<img');
		});
	});
});
