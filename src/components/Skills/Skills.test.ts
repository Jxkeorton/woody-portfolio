import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import Skills from './Skills.astro';
import { full } from '../../utils/siteSettings.fixture';

let container: AstroContainer;
beforeAll(async () => {
	container = await AstroContainer.create();
});

const render = (skills: string[]) => container.renderToString(Skills, { props: { skills } });

describe('Skills', () => {
	describe('given skills', () => {
		it('shows a Skills heading and each skill as a list item, in order', async () => {
			const html = await render(full.skills);
			expect(html).toMatch(/<h2[^>]*>\s*Skills and tools\s*<\/h2>/);
			const items = [...html.matchAll(/<li[^>]*>\s*([^<]*?)\s*<\/li>/g)].map((m) => m[1]);
			expect(items).toEqual(full.skills);
		});

		it('names the list by its heading', async () => {
			const html = await render(full.skills);
			const id = html.match(/<h2[^>]*id="([^"]+)"/)?.[1];
			expect(id).toBeTruthy();
			expect(html).toContain(`aria-labelledby="${id}"`);
		});
	});

	describe('given a very long skill name', () => {
		it('shows all of it', async () => {
			const long = 'Computational fluid dynamics for internal combustion engine intake design';
			expect(await render([long])).toContain(long);
		});
	});

	describe('given no skills', () => {
		it('shows nothing', async () => {
			expect((await render([])).trim()).toBe('');
		});
	});
});
