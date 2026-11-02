import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import TitleBlock from './TitleBlock.astro';
import type { SiteDetail } from '../../utils/siteSettings.types';
import { full } from '../../utils/siteSettings.fixture';

let container: AstroContainer;
beforeAll(async () => {
	container = await AstroContainer.create();
});

const render = (details: SiteDetail[]) =>
	container.renderToString(TitleBlock, { props: { details } });

describe('Title block', () => {
	describe('given details', () => {
		it('pairs each label with its value, in order', async () => {
			const html = await render(full.details);
			const terms = [...html.matchAll(/<dt[^>]*>\s*([^<]*?)\s*<\/dt>/g)].map((m) => m[1]);
			const values = [...html.matchAll(/<dd[^>]*>\s*([^<]*?)\s*<\/dd>/g)].map((m) => m[1]);
			expect(terms).toEqual(full.details.map((d) => d.label));
			expect(values).toEqual(full.details.map((d) => d.value));
		});
	});

	describe('given no details', () => {
		it('shows nothing', async () => {
			expect((await render([])).trim()).toBe('');
		});
	});
});
