import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import Hero from './Hero.astro';
import type { SiteSettings } from '../../utils/siteSettings.types';
import { full, longStatement, minimal } from '../../utils/siteSettings.fixture';

let container: AstroContainer;
beforeAll(async () => {
	container = await AstroContainer.create();
});

const render = (settings: SiteSettings) => container.renderToString(Hero, { props: { settings } });

describe('Hero', () => {
	describe('given full settings', () => {
		it('shows the name as the page heading', async () => {
			expect(await render(full)).toMatch(/<h1[^>]*>\s*Woody Orton\s*<\/h1>/);
		});

		it('shows the statement, role line and availability line', async () => {
			const html = await render(full);
			for (const text of [full.statement, full.roleLine, full.availabilityLine]) {
				expect(html).toContain(text);
			}
		});

		it('offers a labelled navigation to the work, about and contact sections', async () => {
			const html = await render(full);
			expect(html).toContain('<nav');
			for (const href of ['#projects', '#about', '#contact']) {
				expect(html).toContain(`href="${href}"`);
			}
		});
	});

	describe('given title block details', () => {
		it('shows each label with its value', async () => {
			const html = await render(full);
			for (const { label, value } of full.details) {
				expect(html).toContain(label);
				expect(html).toContain(value);
			}
		});
	});

	describe('given only the required fields', () => {
		it('shows the name and statement without the optional lines', async () => {
			const html = await render(minimal);
			expect(html).toContain(minimal.name);
			expect(html).toContain(minimal.statement);
			expect(html).not.toContain('Open to placements');
			expect(html).not.toContain('undefined');
			expect(html).not.toContain('<dl');
		});
	});

	describe('given a very long statement', () => {
		it('shows all of it', async () => {
			expect(await render({ ...full, statement: longStatement })).toContain(longStatement);
		});
	});
});
