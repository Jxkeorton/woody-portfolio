import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import About from './About.astro';
import { full } from '../../utils/siteSettings.fixture';

let container: AstroContainer;
beforeAll(async () => {
	container = await AstroContainer.create();
});

const render = (about?: string) => container.renderToString(About, { props: { about } });

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
});
