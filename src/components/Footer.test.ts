import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import Footer from './Footer.astro';
import type { SiteSettings } from '../utils/siteSettings.types';
import { full, minimal } from '../utils/siteSettings.fixture';

let container: AstroContainer;
beforeAll(async () => {
	container = await AstroContainer.create();
});

const render = (settings: SiteSettings) =>
	container.renderToString(Footer, { props: { settings } });

describe('Footer', () => {
	describe('given an email address', () => {
		it('shows a mailto link with the address as its text', async () => {
			expect(await render(full)).toMatch(
				new RegExp(`<a[^>]*href="mailto:${full.email}"[^>]*>\\s*${full.email}\\s*</a>`),
			);
		});

		it('shows the contact heading and the name in the copyright line', async () => {
			const html = await render(full);
			expect(html).toContain(full.contactHeading);
			expect(html).toContain('Woody Orton. All rights reserved.');
		});
	});

	describe('given a LinkedIn address', () => {
		it('shows a LinkedIn link that opens the profile', async () => {
			const html = await render(full);
			expect(html).toMatch(
				new RegExp(`<a[^>]*href="${full.linkedinUrl}"[^>]*>[\\s\\S]*?LinkedIn[\\s\\S]*?</a>`),
			);
		});

		it('shows a LinkedIn icon that screen readers skip', async () => {
			const html = await render(full);
			expect(html).toMatch(/<svg[^>]*aria-hidden="true"/);
		});
	});

	describe('given no LinkedIn address', () => {
		it('shows no LinkedIn link', async () => {
			const html = await render(minimal);
			expect(html).not.toContain('LinkedIn');
			expect(html).not.toContain('<svg');
		});
	});

	describe('given no email address', () => {
		it('shows the heading but no mailto link', async () => {
			const html = await render(minimal);
			expect(html).toContain(minimal.contactHeading);
			expect(html).not.toContain('mailto:');
		});
	});
});
