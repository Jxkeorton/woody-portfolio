import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import Experience from './Experience.astro';
import type { ExperienceEntry } from '../../utils/cv.types';
import { full, longEntry, placement, society } from '../../utils/cv.fixture';

let container: AstroContainer;
beforeAll(async () => {
	container = await AstroContainer.create();
});

const render = (entries: ExperienceEntry[]) =>
	container.renderToString(Experience, { props: { entries } });

describe('Experience', () => {
	describe('given entries', () => {
		it('shows an Experience heading and each entry as a list item, in order', async () => {
			const html = await render(full.experience);
			expect(html).toMatch(/<h2[^>]*>\s*Experience\s*<\/h2>/);
			expect(html.match(/<li\b/g)).toHaveLength(2);
			expect(html.indexOf(placement.role)).toBeLessThan(html.indexOf(society.role));
		});

		it('shows the role as a heading, with the organisation, period, location and description', async () => {
			const html = await render([placement]);
			expect(html).toMatch(/<h3[^>]*>\s*Placement engineer\s*<\/h3>/);
			for (const text of [
				placement.organisation,
				placement.period,
				placement.location,
				placement.description,
			]) {
				expect(html).toContain(text);
			}
		});

		it('names the section by its heading', async () => {
			const html = await render(full.experience);
			const id = html.match(/<h2[^>]*id="([^"]+)"/)?.[1];
			expect(id).toBeTruthy();
			expect(html).toContain(`aria-labelledby="${id}"`);
		});
	});

	describe('given an entry with only the required fields', () => {
		it('shows it without a location or description', async () => {
			const html = await render([society]);
			expect(html).toContain(society.role);
			expect(html).not.toContain('undefined');
			expect(html).not.toContain('<p class="description');
		});
	});

	describe('given a very long entry', () => {
		it('shows all of it', async () => {
			const html = await render([longEntry]);
			for (const text of [longEntry.role, longEntry.organisation, longEntry.description]) {
				expect(html).toContain(text);
			}
		});
	});

	describe('given no entries', () => {
		it('shows nothing', async () => {
			expect((await render([])).trim()).toBe('');
		});
	});
});
