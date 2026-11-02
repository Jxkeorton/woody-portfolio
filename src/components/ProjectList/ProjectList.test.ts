import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import ProjectList from './ProjectList.astro';
import type { ProjectSummary } from '../../utils/project.types';
import { longTitle, one, projects, two } from './projectList.fixture';

const previewImages = (html: string) =>
	[...html.matchAll(/<img\b([^>]*)>/g)].map((m) => ({
		alt: m[1]!.match(/\salt="([^"]*)"/)?.[1],
		width: m[1]!.match(/\swidth="([^"]*)"/)?.[1],
		height: m[1]!.match(/\sheight="([^"]*)"/)?.[1],
		src: m[1]!.match(/\ssrc="([^"]*)"/)?.[1]?.replace(/&amp;/g, '&'),
	}));

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

	describe('given a project with a cover image', () => {
		it('shows the cover as a preview, hidden from screen readers because the row already names the project', async () => {
			const html = await render([one, two]);
			expect(previewImages(html)).toHaveLength(1);
			expect(previewImages(html)[0]!.alt).toBe('');
			expect(html).toMatch(/<div[^>]*class="previews[^"]*"[^>]*aria-hidden="true"/);
		});

		it('reserves the preview space and serves it cropped around the hotspot', async () => {
			const [img] = previewImages(await render([one]));
			expect([img!.width, img!.height]).toEqual(['800', '600']);
			const url = new URL(img!.src!);
			expect(url.hostname).toBe('cdn.sanity.io');
			expect(url.searchParams.get('w')).toBe('800');
			expect(url.searchParams.get('h')).toBe('600');
			// The 4:3 area of the 16:9 original, pushed as far towards the hotspot as the image allows.
			expect(url.searchParams.get('rect')).toBe('0,0,1200,900');
		});

		it('shows the matching preview when each row is hovered or focused, however many projects there are', async () => {
			const html = await render([one, two, longTitle, two]);
			for (const n of [1, 2, 3, 4]) {
				expect(html).toContain(
					`li:nth-child(${n + 1}) a.row:is(:hover, :focus-visible)) .preview:nth-child(${n})`,
				);
			}
		});

		it('keeps one preview slot per project so each preview matches its row', async () => {
			const html = await render([two, one, two]);
			expect(html.match(/class="preview[\s"]/g)).toHaveLength(3);
		});
	});

	describe('given projects with no cover image', () => {
		it('lists them normally and shows no preview image', async () => {
			const html = await render([two]);
			expect(previewImages(html)).toEqual([]);
			expect(links(html)).toHaveLength(1);
		});

		it('leaves out the preview column entirely when no project has a cover', async () => {
			expect(await render([two])).not.toContain('class="previews');
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
