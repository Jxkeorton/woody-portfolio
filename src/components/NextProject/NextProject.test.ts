import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import NextProject from './NextProject.astro';
import { longTitle, one } from '../ProjectList/projectList.fixture';

let container: AstroContainer;
beforeAll(async () => {
	container = await AstroContainer.create();
});

const render = (props: Record<string, unknown>) => container.renderToString(NextProject, { props });

describe('Next project', () => {
	describe('given a next project', () => {
		it('links to its page', async () => {
			expect(await render({ project: one })).toContain(`href="/projects/${one.slug}"`);
		});

		it('labels the link as the next project and shows its title, system and year', async () => {
			const html = await render({ project: one });
			expect(html).toContain('Next project');
			for (const part of [one.title, one.system, one.year]) {
				expect(html).toContain(part);
			}
		});

		it('is a navigation landmark with a name', async () => {
			expect(await render({ project: one })).toMatch(/<nav[^>]*aria-label="Next project"/);
		});
	});

	describe('given a very long title', () => {
		it('shows all of it', async () => {
			expect(await render({ project: longTitle })).toContain(longTitle.title);
		});
	});

	describe('given no next project', () => {
		it('shows nothing', async () => {
			expect((await render({ project: undefined })).trim()).toBe('');
		});
	});
});
