import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import HomeProjects from './HomeProjects.astro';
import type { ProjectSummary } from '../../utils/project.types';
import { one, projects, sixProjects } from '../ProjectList/projectList.fixture';

let container: AstroContainer;
beforeAll(async () => {
	container = await AstroContainer.create();
});

const render = (list: ProjectSummary[]) =>
	container.renderToString(HomeProjects, { props: { projects: list } });

const projectLinks = (html: string) =>
	[...html.matchAll(/href="(\/projects\/[^"]+)"/g)].map((m) => m[1]);

describe('Home projects', () => {
	describe('given more than four projects', () => {
		it('lists only the first four, in order', async () => {
			expect(projectLinks(await render(sixProjects))).toEqual([
				'/projects/project-1',
				'/projects/project-2',
				'/projects/project-3',
				'/projects/project-4',
			]);
		});

		it('links to the full projects page', async () => {
			expect(await render(sixProjects)).toMatch(
				/<a[^>]*href="\/projects"[^>]*>\s*View all projects/,
			);
		});

		it('states the total number of projects', async () => {
			expect(await render(sixProjects)).toContain('6 projects');
		});
	});

	describe('given four or fewer projects', () => {
		it('lists them all and still links to the projects page', async () => {
			const html = await render(projects);
			expect(projectLinks(html)).toHaveLength(2);
			expect(html).toContain('href="/projects"');
		});

		it('uses the singular for one project', async () => {
			expect(await render([one])).toContain('1 project<');
		});
	});

	it('is the target of the #projects anchor', async () => {
		expect(await render(projects)).toContain('id="projects"');
	});
});
