import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import ProjectDetail from './ProjectDetail.astro';
import { projects } from '../../data/projects';
import { MAX_PARAGRAPHS, type Project } from '../../data/project.types';
import { fullProject, longTitleProject, minimalProject } from './projectDetail.fixture';

let container: AstroContainer;
beforeAll(async () => {
	container = await AstroContainer.create();
});

const render = (project: Project) => container.renderToString(ProjectDetail, { props: { project } });

const all = (html: string, pattern: RegExp) => [...html.matchAll(pattern)];
const headings = (html: string) => all(html, /<h1[^>]*>([^<]*)<\/h1>/g).map((m) => m[1]);
const figures = (html: string) => all(html, /<figure[\s>]/g);
const proseParagraphs = (html: string) => {
	const prose = html.match(/<div class="prose[^"]*"[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? '';
	return all(prose, /<p[^>]*>([^<]*)<\/p>/g).map((m) => m[1]);
};

describe('Project detail', () => {
	describe('given a project with two figures and six paragraphs', () => {
		it('shows the title as the single page heading', async () => {
			expect(headings(await render(fullProject))).toEqual(['Ventilated brake rotor']);
		});

		it('shows both figures with accessible names and captions', async () => {
			const html = await render(fullProject);
			expect(figures(html)).toHaveLength(2);
			expect(html).toContain('aria-label="Rotor, front view. Ø 340 mm"');
			expect(html).toContain('Temperature against time');
		});

		it('shows every paragraph in order', async () => {
			expect(proseParagraphs(await render(fullProject))).toEqual([
				'Paragraph one.',
				'Paragraph two.',
				'Paragraph three.',
				'Paragraph four.',
				'Paragraph five.',
				'Paragraph six.',
			]);
		});

		it('shows the system, context and year', async () => {
			const html = await render(fullProject);
			expect(html).toContain('Brakes');
			expect(html).toContain('Formula Student team');
			expect(html).toContain('2025');
		});

		it('links back to the project list', async () => {
			expect(await render(fullProject)).toMatch(/<a[^>]*href="\/#work"[^>]*>All projects<\/a>/);
		});
	});

	describe('given a project with one figure and one paragraph', () => {
		it('shows only the one figure and the one paragraph', async () => {
			const html = await render(minimalProject);
			expect(figures(html)).toHaveLength(1);
			expect(proseParagraphs(html)).toEqual(['A single paragraph about the project.']);
		});
	});

	describe('given a very long title', () => {
		it('still shows the whole title in a single heading', async () => {
			expect(headings(await render(longTitleProject))).toEqual([longTitleProject.title]);
		});
	});
});

describe('Project data', () => {
	it('has at least one project', () => {
		expect(projects.length).toBeGreaterThan(0);
	});

	it('gives every project a unique id', () => {
		const ids = projects.map((p) => p.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	describe.each(projects.map((p) => [p.id, p] as const))('given the project %s', (_id, project) => {
		it('has one or two figures', () => {
			expect(project.figures.length).toBeGreaterThanOrEqual(1);
			expect(project.figures.length).toBeLessThanOrEqual(2);
		});

		it(`has between one and ${MAX_PARAGRAPHS} paragraphs`, () => {
			expect(project.paragraphs.length).toBeGreaterThanOrEqual(1);
			expect(project.paragraphs.length).toBeLessThanOrEqual(MAX_PARAGRAPHS);
		});

		it('has a url-safe id', () => {
			expect(project.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
		});
	});
});
