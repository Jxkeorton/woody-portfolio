import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import CvDownload from './CvDownload.astro';
import { full } from '../../utils/cv.fixture';

let container: AstroContainer;
beforeAll(async () => {
	container = await AstroContainer.create();
});

const render = (props: Record<string, unknown>) => container.renderToString(CvDownload, { props });

describe('CV download', () => {
	describe('given a CV file', () => {
		it('links to the file, named after the person, so it downloads', async () => {
			const html = await render({ file: full.cvFile, name: 'Woody Orton' });
			expect(html).toContain(full.cvFile!.url);
			expect(html).toContain('dl=Woody-Orton-CV.pdf');
		});

		it('says it is a CV, a PDF and how big it is', async () => {
			const html = await render({ file: full.cvFile, name: 'Woody Orton' });
			expect(html).toMatch(/<a[^>]*>[\s\S]*Download CV[\s\S]*<\/a>/);
			expect(html).toContain('PDF');
			expect(html).toContain('150 KB');
		});
	});

	describe('given a CV file with no known size', () => {
		it('still says it is a PDF', async () => {
			const html = await render({ file: { url: full.cvFile!.url }, name: 'Woody Orton' });
			expect(html).toContain('PDF');
			expect(html).not.toContain('undefined');
			expect(html).not.toContain('NaN');
		});
	});

	describe('given no CV file', () => {
		it('shows nothing', async () => {
			expect((await render({ file: undefined, name: 'Woody Orton' })).trim()).toBe('');
		});
	});
});
