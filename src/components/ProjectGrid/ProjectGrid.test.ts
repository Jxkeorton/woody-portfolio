import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import ProjectGrid from './ProjectGrid.astro';
import type { ProjectSummary } from '../../utils/project.types';
import { longTitle, one, projects, two } from '../ProjectList/projectList.fixture';

let container: AstroContainer;
beforeAll(async () => {
	container = await AstroContainer.create();
});

const render = (list: ProjectSummary[]) =>
	container.renderToString(ProjectGrid, { props: { projects: list } });

const links = (html: string) =>
	[...html.matchAll(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].map((m) => ({
		href: m[1],
		text: m[2]!
			.replace(/<[^>]*>/g, ' ')
			.replace(/\s+/g, ' ')
			.trim(),
	}));

describe('Project grid', () => {
	describe('given several projects', () => {
		it('links each project to its page, in the order given', async () => {
			expect(links(await render(projects)).map((l) => l.href)).toEqual([
				'/projects/practical-vehicle-design',
				'/projects/turbo-response-mapping',
			]);
		});

		it('shows each title, system and year', async () => {
			const [first] = links(await render([one]));
			for (const part of [one.title, one.system, one.year]) {
				expect(first!.text).toContain(part);
			}
		});

		it('lists the projects as list items', async () => {
			expect((await render(projects)).match(/<li[\s>]/g)).toHaveLength(2);
		});
	});

	describe('given a project with a cover image', () => {
		it('shows the cover with its alt text and explicit dimensions', async () => {
			const html = await render([one]);
			const img = html.match(/<img\b([^>]*)>/)![1]!;
			expect(img).toContain(`alt="${one.cover!.alt}"`);
			expect(img).toMatch(/\swidth="\d+"/);
			expect(img).toMatch(/\sheight="\d+"/);
			expect(img).toContain('srcset=');
		});

		it('lazy-loads the cover', async () => {
			expect(await render([one])).toContain('loading="lazy"');
		});
	});

	describe('given a project without a cover image', () => {
		it('still shows the project, without an image', async () => {
			const html = await render([two]);
			expect(html).not.toContain('<img');
			expect(links(html)[0]!.text).toContain(two.title);
		});
	});

	describe('given a very long title', () => {
		it('shows the whole title', async () => {
			expect(links(await render([longTitle]))[0]!.text).toContain(longTitle.title);
		});
	});

	describe('given no projects', () => {
		it('says projects will appear soon', async () => {
			const html = await render([]);
			expect(html).toContain('Projects will appear here soon.');
			expect(html).not.toContain('<li');
		});
	});
});
