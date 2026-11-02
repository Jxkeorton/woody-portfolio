import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import ProjectDetail from './ProjectDetail.astro';
import type { Project } from '../../utils/project.types';
import { fullProject, longTitleProject, minimalProject } from './projectDetail.fixture';

let container: AstroContainer;
beforeAll(async () => {
	container = await AstroContainer.create();
});

const render = (project: Project) =>
	container.renderToString(ProjectDetail, { props: { project } });

const headings = (html: string, level: number) =>
	[...html.matchAll(new RegExp(`<h${level}[^>]*>([^<]*)</h${level}>`, 'g'))].map((m) => m[1]);

describe('Project detail', () => {
	describe('given a project with blocks', () => {
		it('shows the title as the single page heading', async () => {
			expect(headings(await render(fullProject), 1)).toEqual(['Ventilated brake rotor']);
		});

		it('shows the system, context and year', async () => {
			const html = await render(fullProject);
			expect(html).toContain('Brakes');
			expect(html).toContain('Formula Student team');
			expect(html).toContain('2025');
		});

		it('shows the blocks in order below the page heading', async () => {
			const html = await render(fullProject);
			expect(headings(html, 2)).toEqual(['Thermal model', 'Results']);
			expect(headings(html, 3)).toEqual(['Boundary conditions']);
			expect(html.indexOf('Thermal model')).toBeLessThan(html.indexOf('Boundary conditions'));
			expect(html.indexOf('Boundary conditions')).toBeLessThan(html.indexOf('Results'));
		});

		it('links back to the project list', async () => {
			expect(await render(fullProject)).toMatch(/<a[^>]*href="\/#work"[^>]*>All projects<\/a>/);
		});
	});

	describe('given a project with no blocks yet', () => {
		it('shows the title and details without an empty content area', async () => {
			const html = await render(minimalProject);
			expect(headings(html, 1)).toEqual(['Minimal project']);
			expect(html).not.toContain('class="blocks');
		});
	});

	describe('given a very long title', () => {
		it('still shows the whole title in a single heading', async () => {
			expect(headings(await render(longTitleProject), 1)).toEqual([longTitleProject.title]);
		});
	});
});
