import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import ProjectList from './ProjectList.astro';
import type { ProjectSummary } from '../../utils/project.types';
import { longTitle, one, projects, two } from './projectList.fixture';

let container: AstroContainer;
beforeAll(async () => {
	container = await AstroContainer.create();
});

const render = (list: ProjectSummary[]) =>
	container.renderToString(ProjectList, { props: { projects: list } });

const links = (html: string) =>
	[...html.matchAll(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].map((m) => ({
		href: m[1],
		text: m[2]!
			.replace(/<[^>]*>/g, ' ')
			.replace(/\s+/g, ' ')
			.trim(),
	}));

describe('Project list', () => {
	describe('given several projects', () => {
		it('links each project to its page, in the order given', async () => {
			expect(links(await render(projects)).map((l) => l.href)).toEqual([
				'/projects/practical-vehicle-design',
				'/projects/turbo-response-mapping',
			]);
		});

		it('shows each title, system, year and context', async () => {
			const [first] = links(await render([one]));
			for (const part of [one.title, one.system, one.year, one.context]) {
				expect(first!.text).toContain(part);
			}
		});

		it('lists the projects as list items', async () => {
			const html = await render([one, two]);
			expect(html.match(/<li[\s>]/g)?.length).toBeGreaterThanOrEqual(2);
		});
	});

	describe('given a very long title', () => {
		it('shows the whole title', async () => {
			expect(links(await render([longTitle]))[0]!.text).toContain(longTitle.title);
		});
	});

	describe('given no projects', () => {
		it('says projects are coming and shows no links or list', async () => {
			const html = await render([]);
			expect(html).toContain('Projects will appear here soon.');
			expect(links(html)).toEqual([]);
			expect(html).not.toContain('<ul');
		});
	});
});
