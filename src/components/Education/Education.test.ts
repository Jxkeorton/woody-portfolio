import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import Education from './Education.astro';
import type { QualificationEntry } from '../../utils/cv.types';
import { aLevels, degree, full } from '../../utils/cv.fixture';

let container: AstroContainer;
beforeAll(async () => {
	container = await AstroContainer.create();
});

const render = (entries: QualificationEntry[]) =>
	container.renderToString(Education, { props: { entries } });

describe('Education', () => {
	describe('given qualifications', () => {
		it('shows an Education heading and each qualification as a list item, in order', async () => {
			const html = await render(full.qualifications);
			expect(html).toMatch(/<h2[^>]*>\s*Education\s*<\/h2>/);
			expect(html.match(/<li\b/g)).toHaveLength(2);
			expect(html.indexOf(degree.qualification)).toBeLessThan(html.indexOf(aLevels.qualification));
		});

		it('shows the qualification as a heading, with the institution, period, grade and detail', async () => {
			const html = await render([degree]);
			expect(html).toMatch(/<h3[^>]*>\s*BEng Automotive Engineering\s*<\/h3>/);
			for (const text of [degree.institution, degree.period, degree.grade, degree.detail]) {
				expect(html).toContain(text);
			}
		});
	});

	describe('given a qualification with only the required fields', () => {
		it('shows it without a grade or detail', async () => {
			const html = await render([aLevels]);
			expect(html).toContain(aLevels.qualification);
			expect(html).not.toContain('undefined');
		});
	});

	describe('given no qualifications', () => {
		it('shows nothing', async () => {
			expect((await render([])).trim()).toBe('');
		});
	});
});
